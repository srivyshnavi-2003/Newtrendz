const Header = ({restaurantName, cartCount}) => (
  <header className="header">
    <h1 className="restaurant-name">{restaurantName}</h1>

    <div className="cart-container">
      <p className="orders-label">My Orders</p>

      <div
        className="cart-icon-container"
        role="img"
        aria-label={`Shopping cart, ${cartCount} items`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3 3h2l2.4 12h11.2l2-8H6" />
          <circle cx="9" cy="20" r="1" />
          <circle cx="18" cy="20" r="1" />
        </svg>

        <span className="cart-count" aria-live="polite" aria-atomic="true">
          {cartCount}
        </span>
      </div>
    </div>
  </header>
)

export default Header
