import "@typespec/http";
import "@kattebak/typespec-enum-emitter";

using Http;

@service
namespace Shop;

enum OrderState {
	Open: "open",
	Shipped: "shipped",
}

@useAuth(BearerAuth)
@route("/orders")
op listOrders(): OrderState[];
