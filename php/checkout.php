<?php
/**
 * mpowerio.ai - Stripe Checkout Session Handler
 *
 * This file creates Stripe Checkout Sessions for payment processing.
 *
 * SETUP INSTRUCTIONS:
 * 1. Replace 'sk_test_YOUR_SECRET_KEY' with your actual Stripe Secret Key
 * 2. Create Products and Prices in your Stripe Dashboard
 * 3. Replace the price IDs below with your actual Stripe Price IDs
 * 4. For production, use live keys (sk_live_...) instead of test keys
 */

// Enable error reporting for debugging (disable in production)
// error_reporting(E_ALL);
// ini_set('display_errors', 1);

// CORS headers for local development
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// =============================================================================
// CONFIGURATION - UPDATE THESE VALUES
// =============================================================================

// Your Stripe Secret Key (use test key for development)
$stripeSecretKey = 'sk_test_YOUR_SECRET_KEY_HERE';

// Your domain (update for production)
$domain = 'https://mpowerio.ai'; // Change to your actual domain

// Price IDs from your Stripe Dashboard
// To create these:
// 1. Go to Stripe Dashboard > Products
// 2. Create a product for each offering
// 3. Add prices to each product
// 4. Copy the price IDs (they start with 'price_')
$priceMapping = [
    'price_retainer' => 'price_REPLACE_WITH_REAL_ID', // Monthly Retainer - $2000/mo
    'price_starter'  => 'price_REPLACE_WITH_REAL_ID', // Starter Package - $750 one-time
    'price_workshop' => 'price_REPLACE_WITH_REAL_ID', // AI Workshop - $500 one-time
];

// =============================================================================
// STRIPE API INTEGRATION
// =============================================================================

// Get the request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Validate required fields
if (!isset($data['priceId']) || !isset($data['mode'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

// Map the price ID to the actual Stripe price ID
$priceId = $data['priceId'];
if (isset($priceMapping[$priceId])) {
    $stripePriceId = $priceMapping[$priceId];
} else {
    // If it's already a real Stripe price ID, use it directly
    $stripePriceId = $priceId;
}

// Validate the price ID format (should start with 'price_')
if (strpos($stripePriceId, 'price_') !== 0 || $stripePriceId === 'price_REPLACE_WITH_REAL_ID') {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid price configuration. Please configure your Stripe Price IDs.']);
    exit();
}

// Prepare the checkout session parameters
$mode = $data['mode'] === 'subscription' ? 'subscription' : 'payment';
$successUrl = isset($data['successUrl']) ? $data['successUrl'] : $domain . '/success.html';
$cancelUrl = isset($data['cancelUrl']) ? $data['cancelUrl'] : $domain . '/checkout.html';

// Build the session creation request
$sessionData = [
    'payment_method_types' => ['card'],
    'line_items' => [[
        'price' => $stripePriceId,
        'quantity' => 1,
    ]],
    'mode' => $mode,
    'success_url' => $successUrl . '?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => $cancelUrl,
];

// Add customer email if provided
if (isset($data['customerEmail']) && !empty($data['customerEmail'])) {
    $sessionData['customer_email'] = $data['customerEmail'];
}

// Add metadata
$sessionData['metadata'] = [
    'customer_name' => isset($data['customerName']) ? $data['customerName'] : '',
    'company' => isset($data['company']) ? $data['company'] : '',
];

// Make the API request to Stripe
$ch = curl_init('https://api.stripe.com/v1/checkout/sessions');

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $stripeSecretKey,
        'Content-Type: application/x-www-form-urlencoded',
    ],
    CURLOPT_POSTFIELDS => http_build_query($sessionData),
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// Handle curl errors
if ($curlError) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to connect to payment processor']);
    exit();
}

// Parse the response
$session = json_decode($response, true);

// Handle Stripe errors
if ($httpCode !== 200 || isset($session['error'])) {
    $errorMessage = isset($session['error']['message'])
        ? $session['error']['message']
        : 'Payment processing error';

    http_response_code(400);
    echo json_encode(['error' => $errorMessage]);
    exit();
}

// Return the session URL for redirect
echo json_encode([
    'url' => $session['url'],
    'sessionId' => $session['id']
]);
