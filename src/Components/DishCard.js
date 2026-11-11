const DishCard = ({dish, quantity, onUpdateQuantity}) => {
  const {
    dish_id: dishId,
    dish_name: dishName,
    dish_price: dishPrice,
    dish_currency: dishCurrency,
    dish_calories: dishCalories,
    dish_description: dishDescription,
    dish_image: dishImage,
    dish_Availability: isAvailable,
    dish_Type: dishType,
    addoncat,
  } = dish

  const isVegetarian = Number(dishType) === 2
  const hasCustomizations = Array.isArray(addoncat) && addoncat.length > 0

  return (
    <li className="dish-card">
      <span
        className={`food-type ${isVegetarian ? 'veg' : 'non-veg'}`}
        role="img"
        aria-label={isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}
      >
        <span className="food-type-dot" />
      </span>

      <div className="dish-details">
        <h2 className="dish-name">{dishName}</h2>

        <p className="dish-price">
          {dishCurrency} {dishPrice}
        </p>

        <p className="dish-description">{dishDescription}</p>

        {isAvailable ? (
          <div
            className="quantity-control"
            role="group"
            aria-label={`Quantity for ${dishName}`}
          >
            <button
              type="button"
              className="quantity-button"
              aria-label={`Decrease quantity of ${dishName}`}
              onClick={() => onUpdateQuantity(dishId, -1)}
              disabled={quantity === 0}
            >
              -
            </button>

            <span className="quantity-value" aria-live="polite">
              {quantity}
            </span>

            <button
              type="button"
              className="quantity-button"
              aria-label={`Increase quantity of ${dishName}`}
              onClick={() => onUpdateQuantity(dishId, 1)}
            >
              +
            </button>
          </div>
        ) : (
          <p className="not-available">Not available</p>
        )}

        {hasCustomizations && (
          <p className="customizations">Customizations available</p>
        )}
      </div>

      <p className="dish-calories">{dishCalories} calories</p>

      <img
        className="dish-image"
        src={dishImage}
        alt={dishName}
        loading="lazy"
      />
    </li>
  )
}

export default DishCard
