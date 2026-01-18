# mpowerio.ai Website

**Quality Inputs producing Quantum Outputs**

Enterprise-grade AI consulting, tech strategy, custom development, and training for startups and small businesses.

---

## Project Structure

```
mpowerio_website/
├── index.html          # Homepage
├── about.html          # About page
├── services.html       # Services & pricing
├── contact.html        # Contact form
├── checkout.html       # Stripe checkout
├── success.html        # Payment success
├── css/
│   └── style.css       # Main stylesheet
├── js/
│   └── main.js         # JavaScript + Stripe
├── php/
│   └── checkout.php    # Stripe backend
└── images/
    └── logo.png        # Your logo (add this)
```

---

## Quick Start

### 1. Add Your Logo

Place your logo file at `images/logo.png`

### 2. Configure Stripe

#### In Stripe Dashboard:
1. Create an account at [stripe.com](https://stripe.com)
2. Go to **Products** → Create products for:
   - Monthly Retainer ($2,000/month, recurring)
   - Starter Package ($750, one-time)
   - AI Workshop ($500, one-time)
3. Copy each **Price ID** (starts with `price_`)

#### In Your Code:

**js/main.js** (line ~180):
```javascript
const stripe = Stripe('pk_test_YOUR_PUBLISHABLE_KEY');
```

**php/checkout.php** (lines ~30-45):
```php
$stripeSecretKey = 'sk_test_YOUR_SECRET_KEY';

$priceMapping = [
    'price_retainer' => 'price_YOUR_ACTUAL_ID',
    'price_starter'  => 'price_YOUR_ACTUAL_ID',
    'price_workshop' => 'price_YOUR_ACTUAL_ID',
];
```

### 3. Test Locally

Open `index.html` in your browser to preview the site.

For Stripe testing, use test card: `4242 4242 4242 4242`

---

## Deployment

### Option A: GoDaddy with PHP (cPanel/Web Hosting)

1. Log into GoDaddy cPanel
2. Open **File Manager**
3. Navigate to `public_html`
4. Upload all files
5. Update `php/checkout.php` with your Stripe keys
6. Update the `$domain` variable to your actual domain
7. Ensure PHP version is 7.4 or higher

### Option B: GoDaddy Website Builder (No PHP)

If your GoDaddy plan doesn't support PHP, you'll need to host the checkout endpoint elsewhere:

**Using Vercel (free):**
1. Create a free account at [vercel.com](https://vercel.com)
2. Deploy the `php/checkout.php` as a serverless function
3. Update `js/main.js` to point to your Vercel URL:
   ```javascript
   const response = await fetch('https://your-app.vercel.app/api/checkout', {
   ```

**Using Netlify Functions (free):**
Similar process - convert PHP to Node.js and deploy as a Netlify Function.

---

## Customization

### Colors (css/style.css)

The color palette is based on your logo:
```css
--tech-blue: #2563eb;      /* Circuit board blue */
--nature-green: #22c55e;   /* Organic green */
--earth-brown: #78350f;    /* Grounding earth */
--diamond-blue: #0ea5e9;   /* Premium accent */
```

### Pricing

Update prices in:
- `services.html` - Display prices
- `checkout.html` - Checkout options
- `js/main.js` - Plan details object
- Stripe Dashboard - Actual charge amounts

### Contact Info

Search and replace:
- `hello@mpowerio.ai` - Your email
- Social media links in footer

---

## Production Checklist

- [ ] Add logo to `images/logo.png`
- [ ] Replace test Stripe keys with live keys
- [ ] Update price IDs with production IDs
- [ ] Update domain in `php/checkout.php`
- [ ] Test full checkout flow
- [ ] Set up email notifications in Stripe
- [ ] Connect bank account in Stripe
- [ ] Update footer year if needed
- [ ] Add analytics (Google Analytics, etc.)
- [ ] Set up contact form backend (Formspree, etc.)

---

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - No frameworks needed
- **PHP** - Stripe backend (or serverless alternative)
- **Stripe** - Payment processing

---

## Support

Questions about this website? Check the code comments or reach out.

Built with care for mpowerio.ai LLC.
