# Extracts per-product ground truth from the WooCommerce HTML mirror into JSON.
# Usage: powershell -File scripts/extract-mirror-data.ps1
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$dirs = Get-ChildItem -LiteralPath (Join-Path $root "product") -Directory
$out = @()
foreach ($d in $dirs) {
  $f = Join-Path $d.FullName "index.html"
  if (-not (Test-Path $f)) { continue }
  $html = [System.IO.File]::ReadAllText($f)
  $p = [ordered]@{ slug = $d.Name }

  # Title
  if ($html -match '(?s)<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>(.*?)</h1>') {
    $p.title = (($matches[1] -replace '<[^>]+>', '') -replace '\s+', ' ').Trim()
  }

  # Category (from breadcrumb / product_meta)
  if ($html -match '(?s)<span class="posted_in">.*?product-category/([^"/]+)') { $p.categorySlug = $matches[1] }

  # Price block (decode entities, then take distinct decimal amounts in order)
  if ($html -match '(?s)<p class="price">(.*?)</p>') {
    $raw = $matches[1]
    $decoded = [System.Net.WebUtility]::HtmlDecode((($raw -replace '<[^>]+>', ' ') -replace '\s+', ' ').Trim())
    $p.priceHtml = $decoded
    $nums = @([regex]::Matches($decoded, '(\d+\.\d{2})') | ForEach-Object { $_.Groups[1].Value } | Select-Object -Unique)
    if ($nums.Count -ge 2) { $p.priceMin = [double]$nums[0]; $p.priceMax = [double]$nums[1] }
    elseif ($nums.Count -eq 1) { $p.price = [double]$nums[0] }
  }

  # Attributes: ordered select lists (skip grouped/quantity selects)
  $attrs = [ordered]@{}
  $attrLabels = [ordered]@{}
  $form = [regex]::Match($html, '(?s)<form class="variations[^"]*".*?</form>')
  $formHtml = if ($form.Success) { $form.Value } else { '' }
  # label map: <label for="id">Text</label>
  $labelMap = @{}
  foreach ($lm in [regex]::Matches($formHtml, '(?s)<label[^>]*for="([^"]+)"[^>]*>(.*?)</label>')) {
    $labelMap[$lm.Groups[1].Value] = ((($lm.Groups[2].Value -replace '<[^>]+>', '') -replace '\s+', ' ').Trim())
  }
  foreach ($m in [regex]::Matches($formHtml, '(?s)<select[^>]*id="([^"]*)"[^>]*name="attribute_([^"]+)"[^>]*>(.*?)</select>')) {
    $sid = $m.Groups[1].Value
    $name = $m.Groups[2].Value
    $vals = [regex]::Matches($m.Groups[3].Value, '<option[^>]*value="([^"]*)"[^>]*>([^<]*)</option>') |
      ForEach-Object { [System.Net.WebUtility]::HtmlDecode($_.Groups[2].Value).Trim() } |
      Where-Object { $_ -and $_ -notmatch 'Choose an option' }
    $attrs[$name] = @($vals)
    if ($labelMap.ContainsKey($sid)) { $attrLabels[$name] = $labelMap[$sid] }
  }
  if ($attrs.Count -eq 0) {
    foreach ($m in [regex]::Matches($html, '(?s)<select[^>]*id="([^"]*)"[^>]*name="attribute_([^"]+)"[^>]*>(.*?)</select>')) {
      $sid = $m.Groups[1].Value
      $name = $m.Groups[2].Value
      $vals = [regex]::Matches($m.Groups[3].Value, '<option[^>]*value="([^"]*)"[^>]*>([^<]*)</option>') |
        ForEach-Object { [System.Net.WebUtility]::HtmlDecode($_.Groups[2].Value).Trim() } |
        Where-Object { $_ -and $_ -notmatch 'Choose an option' }
      $attrs[$name] = @($vals)
      if ($labelMap.ContainsKey($sid)) { $attrLabels[$name] = $labelMap[$sid] }
    }
  }
  $p.attributes = $attrs
  $p.attributeLabels = $attrLabels

  # Variation matrix
  $vm = [regex]::Match($html, 'data-product_variations="([^"]*)"')
  if ($vm.Success) {
    $dec = [System.Net.WebUtility]::HtmlDecode($vm.Groups[1].Value)
    if ($dec.Trim() -eq 'false') {
      $p.variationMatrix = $null
      $p.variationMatrixPresent = $false
    } else {
      $p.variationMatrixPresent = $true
      try {
        $v = $dec | ConvertFrom-Json
        $p.variations = @($v | ForEach-Object {
          [ordered]@{
            attributes = $_.attributes
            price = $_.display_price
            regularPrice = $_.display_regular_price
            inStock = $_.is_in_stock
            purchasable = $_.is_purchasable
            image = $_.image.full_src
            sku = $_.sku
            variationId = $_.variation_id
          }
        })
      } catch { $p.variationParseError = $_.Exception.Message }
    }
  } else {
    $p.variationMatrixPresent = $false
  }

  # Gallery: collect distinct uploads from the product gallery block (data-large-image or title=*.jpeg), full-size
  $gal = [regex]::Match($html, '(?s)<div class="woocommerce-product-gallery\b.*?</div>\s*<div class="summary')
  $galHtml = if ($gal.Success) { $gal.Value } else { '' }
  $gallery = [System.Collections.Generic.List[string]]::new()
  foreach ($m in [regex]::Matches($galHtml, 'data-large-image="(https://printityourway\.com/wp-content/uploads/[^"]+)"')) {
    $u = $m.Groups[1].Value
    if ($u -notmatch 'wd-ship|grocery|Print-it' -and $gallery -notcontains $u) { $gallery.Add($u) }
  }
  if ($gallery.Count -eq 0) {
    foreach ($m in [regex]::Matches($galHtml, 'title="([^"]+\.(?:jpe?g|png|webp))"')) {
      $u = "https://printityourway.com/wp-content/uploads/2026/01/" + $m.Groups[1].Value
      if ($gallery -notcontains $u) { $gallery.Add($u) }
    }
  }
  $p.gallery = @($gallery)
  if ($gallery.Count -gt 0) { $p.image = $gallery[0] }

  # Description tab (WooCommerce tab-description). Convert block HTML to paragraph list.
  $dm = [regex]::Match($html, '(?s)id="tab-description"[^>]*>(.*?)</div>')
  if ($dm.Success) {
    $inner = $dm.Groups[1].Value -replace '(?s)<div class="wc-tab-inner[^"]*">', ''
    $inner = $inner -replace '(?s)</div>\s*$', ''
    # split into block elements
    $blocks = [regex]::Matches($inner, '(?s)<(p|h\d|li|ul|ol)[^>]*>(.*?)</\1>')
    $paras = foreach ($b in $blocks) {
      $tag = $b.Groups[1].Value
      $content = $b.Groups[2].Value
      $content = $content -replace '(?i)<br\s*/?>', "`n"
      $content = $content -replace '<li[^>]*>', '- '
      $content = $content -replace '</li>', ''
      $content = [System.Net.WebUtility]::HtmlDecode(($content -replace '<[^>]+>', ''))
      $content = ($content -replace '[ \t]+', ' ') -replace ' *\n *', "`n" -replace "\n{2,}", "`n"
      $content.Trim()
    }
    $p.descriptionParagraphs = @($paras | Where-Object { $_ })
  }

  # SKU (product-level)
  if ($html -match '(?s)<span class="sku">(.*?)</span>') { $p.sku = ($matches[1] -replace '<[^>]+>', '').Trim() }

  $out += [pscustomobject]$p
}
$jsonPath = Join-Path $root "scripts/mirror-products.json"
$json = $out | ConvertTo-Json -Depth 8
[System.IO.File]::WriteAllText($jsonPath, $json, [System.Text.UTF8Encoding]::new($false))
Write-Output "Wrote $($out.Count) products to $jsonPath"
foreach ($p in $out) {
  Write-Output ("{0}: attrs={1} gallery={2} variations={3} desc={4} price={5}" -f $p.slug, (($p.attributes.PSObject.Properties.Name) -join ','), $p.gallery.Count, $(if ($p.variations) { $p.variations.Count } else { 0 }), $(if ($p.descriptionParagraphs) { $p.descriptionParagraphs.Count } else { 0 }), $(if ($p.PSObject.Properties['price']) { $p.price } else { "$($p.priceMin)-$($p.priceMax)" }))
}
