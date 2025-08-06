const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  try {
    const { price, gig, userId, gigImg } = req.body;

    if (!price || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    //Convert price to cents
    const amountInCents = Math.round(price * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: gig.title,
              description: `Purchase for gig ID: by user ID: ${userId}`,
              images: [gigImg],
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      billing_address_collection: "required",
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}paymentprocessing?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}cancelpayment`,
    });

    // ADD THIS LINE TO SEND THE SESSION URL BACK TO THE CLIENT
    return res.json({ url: session.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
