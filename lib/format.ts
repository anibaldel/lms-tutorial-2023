export const formatPrice = (price: number)=> {
    return new Intl.NumberFormat("es-BO", {
        style: "currency",
        currency: "BOB"
    }).format(price)
}