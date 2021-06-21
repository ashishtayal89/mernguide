## API for pizza delivery company

### Specs

1. New users can be created, their information can be edited, and they can be deleted. We should store their name, email address, and street address.

2. Users can log in and log out by creating or destroying a token.

3. When a user is logged in, they should be able to GET all the possible menu items (these items can be hardcoded into the system).

4. A logged-in user should be able to fill a shopping cart with menu items

5. A logged-in user should be able to create an order. You should integrate with the Sandbox of Stripe.com to accept their payment. Note: Use the stripe sandbox for your testing. Follow this link and click on the "tokens" tab to see the fake tokens you can use server-side to confirm the integration is working: https://stripe.com/docs/testing#cards

6. When an order is placed, you should email the user a receipt. You should integrate with the sandbox of Mailgun.com for this. Note: Every Mailgun account comes with a sandbox email account domain (whatever@sandbox123.mailgun.org) that you can send from by default. So, there's no need to setup any DNS for your domain for this task https://documentation.mailgun.com/en/latest/faqs.html#how-do-i-pick-a-domain-name-for-my-mailgun-account

### Start

1. Start the application using `node index.js`. This will start an application `localhost:3000`.
2. Browse this to go to the login page. Before login you need to signup yourself which you can do by going to the signup screen.
3. After signup you can login to the application which has a listing of products.
4. You can add different products into your cart and then checkout.
5. After checkout you be asked to enter the card details. You can use the below dummy card details.

```javascript
// 4242 4242 4242 4242
// Any future date
// Any CVV and PIN
```

6. Upon successfull payment you will be shown a success message on the screen and a order reciept will be sent to you email.
