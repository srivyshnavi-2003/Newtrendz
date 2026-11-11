const CategoryTabs = ({categories, activeCategoryId, onSelectCategory}) => {
  const handleCategoryClick = (event, categoryId) => {
    onSelectCategory(categoryId)

    event.currentTarget.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    })
  }

  return (
    <nav className="category-navigation" aria-label="Menu categories">
      <ul className="category-list">
        {categories.map(category => {
          const isActive = category.menu_category_id === activeCategoryId

          return (
            <li className="category-item" key={category.menu_category_id}>
              <button
                type="button"
                className={`category-button ${isActive ? 'active' : ''}`}
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

export default CategoryTabs
