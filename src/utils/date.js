export function getDeliverDate() {
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  if (deliveryDate.getDay() === 0)
    deliveryDate.setDate(deliveryDate.getDate() + 1);
  return deliveryDate;
}
