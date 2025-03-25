// Template JSON stored as a constant
const template = {
  landingPage: "/wp-admin/admin.php?page=wc-admin",
  login: true,
  features: { networking: true },
  steps: [
    {
      step: "installPlugin",
      pluginData: {
        resource: "url",
        url: "https://github-proxy.com/proxy/?repo=woocommerce/woocommerce&release={release}&asset=woocommerce.zip",
      },
    },
    {
      step: "writeFile",
      path: "/wordpress/wp-content/mu-plugins/rewrite.php",
      data: "<?php /* Use pretty permalinks */ add_action( 'after_setup_theme', function() { global $wp_rewrite; $wp_rewrite->set_permalink_structure('/%postname%/'); $wp_rewrite->flush_rules(); } );",
    },
    {
      step: "setSiteOptions",
      options: {
        blogname: "WooCommerce",
        woocommerce_store_city: "San Francisco",
        woocommerce_store_address: "123 Main St",
        woocommerce_store_postcode: "94123",
        woocommerce_default_country: "United States",
        woocommerce_onboarding_profile: {
          skipped: true,
        },
        woocommerce_currency: "USD",
        woocommerce_weight_unit: "lbs",
        woocommerce_dimension_unit: "in",
        woocommerce_allow_tracking: "no",
        woocommerce_cheque_settings: {
          enabled: "yes",
        },
      },
    },
    {
      step: "importWxr",
      file: {
        resource: "url",
        url: "https://raw.githubusercontent.com/woocommerce/woocommerce/refs/heads/trunk/plugins/woocommerce/sample-data/sample_products.xml",
      },
    },
  ],
};

export default {
  async fetch(request, env, ctx) {
    // Parse the URL to get the release parameter
    const url = new URL(request.url);
    const release = url.searchParams.get("release") || "latest";

    // Create a deep copy of the template
    const response = JSON.parse(JSON.stringify(template));

    // Update the release in the URL
    response.steps[0].pluginData.url = response.steps[0].pluginData.url.replace(
      "{release}",
      release
    );

    // Return the JSON with proper headers
    return new Response(JSON.stringify(response, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};
