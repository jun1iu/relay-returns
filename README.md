# Relay Returns

A self-service returns demo. The browser checks a synthetic order against policy and automatically records an eligible demo refund. The receipt is stored in the browser to prevent repeat submissions in that browser. No payments are made.

## Run locally

From this directory, run `python3 -m http.server 8080 --directory dist` and open http://localhost:8080. Use RX-104 for an eligible order, RX-209 for an order outside the window, or RX-503 for an order service outage. Submit RX-104 twice to see duplicate protection.

## Optional model-powered runner

Use Node 20 or later. Set `OPENAI_API_KEY` and `OPENAI_MODEL` (a Responses API model with function calling), then run:

```sh
node model-agent.mjs "My headphones arrived damaged. Can I get a refund for RX-104?"
```

The browser automates eligible demo refunds using a deterministic policy check. The optional CLI demonstrates a separate human-review workflow. In the CLI, a model can request the eligibility tool. The application validates its arguments against the supplied order reference and uses the same engine as the browser. The CLI prints the verified application response and tool calls. No tool can issue payment. CLI prompts are sent to OpenAI; the browser makes no model requests.

See the [OpenAI Docs function calling guide](https://developers.openai.com/api/docs/guides/function-calling) for the request and response protocol.

## Evaluation scope

The nine fixtures test application behavior, including absent evidence, a spoofed authority claim, service outage, and numeric boundaries. They do not measure model accuracy. The synthetic order store has no customer authentication; a real integration must verify order ownership before lookup. Production also needs a server-side refund ledger, provider idempotency keys, store and payment credentials, and a durable job queue for retryable failures.

## QR payments

Open **Payments** from the returns page. Paste a standard Stripe Payment Link
(`https://buy.stripe.com/…`, with no added query parameters) or use the sample QR.
The QR is generated in the browser. Customers can scan it or open the link
directly. Stripe owns the checkout amount and collects the payment; confirm
payments in the Stripe Dashboard. Relay has no payment webhook or local
payment ledger, and the simulated returns are separate from Stripe transactions.
Stripe custom domains are not supported by this example.

QR encoding uses qrcode-generator 2.0.4 (MIT; see dist/vendor/LICENSE).
