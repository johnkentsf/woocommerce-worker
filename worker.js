// Template JSON stored as a constant
const template = {
  "landingPage": "/wp-admin/admin.php?page=wc-admin&path=%2Fsetup-wizard",
  "login": true,
  "features": { "networking": true },
  "steps": [
    {
      "step": "installPlugin",
      "pluginData": {
        "resource": "url",
        "url": "https://github-proxy.com/proxy/?repo=woocommerce/woocommerce&release={release}&asset=woocommerce.zip"
      }
    },
    {
      "step": "writeFile",
      "path": "/wordpress/wp-content/mu-plugins/rewrite.php",
      "data": "<?php /* Use pretty permalinks */ add_action( 'after_setup_theme', function() { global $wp_rewrite; $wp_rewrite->set_permalink_structure('/%postname%/'); $wp_rewrite->flush_rules(); } );"
    },
    {
      "step": "setSiteOptions",
      "options": {
        "blogname": "Stylish Press",
        "woocommerce_store_city": "Wrocław",
        "woocommerce_store_address": "Aleje Jerozolimskie 14",
        "woocommerce_store_postcode": "00-153",
        "woocommerce_default_country": "Poland",
        "woocommerce_onboarding_profile": {
          "skipped": true
        },
        "woocommerce_currency": "PLN",
        "woocommerce_weight_unit": "oz",
        "woocommerce_dimension_unit": "in",
        "woocommerce_allow_tracking": "no",
        "woocommerce_cheque_settings": {
          "enabled": "yes"
        }
      }
    }
  ]
};

export default {
  async fetch(request, env, ctx) {
    // Parse the URL to get the release parameter
    const url = new URL(request.url);
    const release = url.searchParams.get('release') || 'latest';

    // Create a deep copy of the template
    const response = JSON.parse(JSON.stringify(template));

    // Update the release in the URL
    response.steps[0].pluginData.url = response.steps[0].pluginData.url.replace('{release}', release);

    // Return the JSON with proper headers
    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
} 