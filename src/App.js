import {useEffect, useState} from 'react'
import './App.css'

const API_URL =
  'https://apis2.ccbp.in/restaurant-app/restaurant-menu-list-details'

const Header = ({restaurantName, cartCount}) => (
  <header className='header'>
    <h1 className='restaurant-name'>{restaurantName}</h1>

    <div className='cart-container'>
      <p className='orders-label'>My Orders</p>

      <div
        className='cart-icon-container'
        role='img'
        aria-label={`Shopping cart with ${cartCount} items`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='30'
          height='30'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='1.8'
          strokeLinecap='round'
          strokeLinejoin='round'
          aria-hidden='true'
        >
          <path d='M3 3h2l2.4 12h11.2l2-8H6' />
          <circle cx='9' cy='20' r='1' />
          <circle cx='18' cy='20' r='1' />
        </svg>

        <span className='cart-count' aria-live='polite'>
          {cartCount}
        </span>
      </div>
    </div>
  </header>
)

const CategoryTabs = ({categories, activeCategoryId, onSelectCategory}) => {
  const handleCategoryClick = (event, categoryId) => {
    onSelectCategory(categoryId)

    if (typeof event.currentTarget.scrollIntoView === 'function') {
      event.currentTarget.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    }
  }

  return (
    <nav className='category-navigation' aria-label='Menu categories'>
      <ul className='category-list'>
        {categories.map(category => {
          const isActive = category.menu_category_id === activeCategoryId

          return (
            <li key={category.menu_category_id} className='category-item'>
              <button
                type='button'
                className={`category-button ${
                  isActive ? 'active-category' : ''
                }`}
                aria-pressed={isActive}
                onClick={event =>
                  handleCategoryClick(event, category.menu_category_id)
                }
              >
                {category.menu_category}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

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
  } = dish

  const isVegetarian = Number(dishType) === 2

  const hasCustomizations = [dish.addonCat, dish.addoncat].some(
    addons => Array.isArray(addons) && addons.length > 0,
  )

  return (
    <li className='dish-card'>
      <span
        className={`food-type ${
          isVegetarian ? 'vegetarian' : 'non-vegetarian'
        }`}
        role='img'
        aria-label={isVegetarian ? 'Vegetarian' : 'Non-vegetarian'}
      >
        <span className='food-type-dot' />
      </span>

      <div className='dish-details'>
        <h2 className='dish-name'>{dishName}</h2>

        <p className='dish-price'>{`${dishCurrency} ${dishPrice}`}</p>

        <p className='dish-description'>{dishDescription}</p>

        {isAvailable ? (
          <div
            className='quantity-control'
            role='group'
            aria-label={`Quantity for ${dishName}`}
          >
            <button
              type='button'
              className='quantity-button'
              onClick={() => onUpdateQuantity(dishId, -1)}
            >
              -
            </button>

            <p className='quantity-value' aria-live='polite'>
              {quantity}
            </p>

            <button
              type='button'
              className='quantity-button'
              onClick={() => onUpdateQuantity(dishId, 1)}
            >
              +
            </button>
          </div>
        ) : (
          <p className='not-available'>Not available</p>
        )}

        {hasCustomizations && (
          <p className='customizations'>Customizations available</p>
        )}
      </div>

      <p className='dish-calories'>{`${dishCalories} calories`}</p>

      <img src={dishImage} alt={dishName} className='dish-image' />
    </li>
  )
}

const App = () => {
  const [menuState, setMenuState] = useState({
    status: 'loading',
    restaurant: null,
    activeCategoryId: '',
  })

  const [quantities, setQuantities] = useState({})
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    const getRestaurantDetails = async () => {
      setMenuState({
        status: 'loading',
        restaurant: null,
        activeCategoryId: '',
      })

      try {
        const response = await fetch(API_URL, {
          method: 'GET',
        })

        if (response.ok === false) {
          throw new Error(`Menu request failed with status ${response.status}`)
        }

        const data = await response.json()

        const restaurant = Array.isArray(data) ? data[0] : data

        if (!restaurant || !Array.isArray(restaurant.table_menu_list)) {
          throw new Error('Expected table_menu_list in the restaurant response')
        }

        if (!isMounted) {
          return
        }

        const firstCategory = restaurant.table_menu_list[0]

        setMenuState({
          status: 'success',
          restaurant,
          activeCategoryId: firstCategory ? firstCategory.menu_category_id : '',
        })
      } catch (error) {
        if (isMounted) {
          console.error('Restaurant menu error:', error)

          setMenuState({
            status: 'failure',
            restaurant: null,
            activeCategoryId: '',
          })
        }
      }
    }

    getRestaurantDetails()

    return () => {
      isMounted = false
    }
  }, [retryCount])

  const selectCategory = categoryId => {
    setMenuState(previousState => ({
      ...previousState,
      activeCategoryId: categoryId,
    }))
  }

  const updateQuantity = (dishId, change) => {
    setQuantities(previousQuantities => {
      const currentQuantity = previousQuantities[dishId] || 0

      return {
        ...previousQuantities,
        [dishId]: Math.max(0, currentQuantity + change),
      }
    })
  }

  const {status, restaurant, activeCategoryId} = menuState

  if (status === 'loading') {
    return (
      <div className='restaurant-app'>
        <div className='status-container' role='status'>
          <div className='loader' />
          <p>Loading menu...</p>
        </div>
      </div>
    )
  }

  if (status === 'failure') {
    return (
      <div className='restaurant-app'>
        <div className='status-container' role='alert'>
          <h2>Something went wrong</h2>

          <p>We could not load the menu. Please try again.</p>

          <button
            type='button'
            className='retry-button'
            onClick={() => setRetryCount(previousCount => previousCount + 1)}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const categories = restaurant.table_menu_list

  const activeCategory = categories.find(
    category => category.menu_category_id === activeCategoryId,
  )

  const dishes = activeCategory ? activeCategory.category_dishes || [] : []

  const cartCount = Object.values(quantities).reduce(
    (total, quantity) => total + quantity,
    0,
  )

  return (
    <div className='restaurant-app'>
      <Header
        restaurantName={restaurant.restaurant_name}
        cartCount={cartCount}
      />

      <CategoryTabs
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={selectCategory}
      />

      <main className='menu-content'>
        {dishes.length > 0 ? (
          <ul className='dish-list'>
            {dishes.map(dish => (
              <DishCard
                key={dish.dish_id}
                dish={dish}
                quantity={quantities[dish.dish_id] || 0}
                onUpdateQuantity={updateQuantity}
              />
            ))}
          </ul>
        ) : (
          <p className='empty-message'>No dishes available in this category.</p>
        )}
      </main>
    </div>
  )
}

export default App
