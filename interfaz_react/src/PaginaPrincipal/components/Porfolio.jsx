import React, { useState } from 'react';

// Importar imágenes
import app1 from '../../assets/img/portfolio/app1.jpg';
import app2 from '../../assets/img/portfolio/app2.jpg';
import app3 from '../../assets/img/portfolio/app3.jpg';
import card1 from '../../assets/img/portfolio/card1.jpg';
import card2 from '../../assets/img/portfolio/card2.jpg';
import card3 from '../../assets/img/portfolio/card3.jpg';
import web1 from '../../assets/img/portfolio/web1.jpg';
import web2 from '../../assets/img/portfolio/web2.jpg';
import web3 from '../../assets/img/portfolio/web3.jpg';

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const portfolioItems = [
    { id: 1, category: 'app', title: 'App 1', img: app1 },
    { id: 2, category: 'web', title: 'Web 3', img: web1 },
    { id: 3, category: 'app', title: 'App 2', img: app2 },
    { id: 4, category: 'card', title: 'Card 2', img: card2 },
    { id: 5, category: 'web', title: 'Web 2', img: web2 },
    { id: 6, category: 'app', title: 'App 3', img: app3 },
    { id: 7, category: 'card', title: 'Card 1', img: card1 },
    { id: 8, category: 'card', title: 'Card 3', img: card3 },
    { id: 9, category: 'web', title: 'Web 1', img: web3 }
  ];

  const filters = ['all', 'app', 'card', 'web'];

  const filteredItems = activeFilter === 'all'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <section id="portfolio" className="clearfix">
      <div className="container">
        <header className="section-header">
          <h3 className="section-title">Galeria</h3>
        </header>

        <div className="row">
          <div className="col-lg-12">
            <ul id="portfolio-flters">
              {filters.map(filter => (
                <li
                  key={filter}
                  className={activeFilter === filter ? 'filter-active' : ''}
                  onClick={() => handleFilterClick(filter)}
                  style={{ cursor: 'pointer' }}
                >
                  {capitalizeFirstLetter(filter)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="row portfolio-container">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`col-lg-4 col-md-6 portfolio-item filter-${item.category}`}
            >
              <div className="portfolio-wrap">
                <img src={item.img} className="img-fluid" alt={item.title} />
                <div className="portfolio-info">
                  <h4><a href="#">{item.title}</a></h4>
                  <p>{capitalizeFirstLetter(item.category)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;