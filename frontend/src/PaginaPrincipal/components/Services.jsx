import React from 'react';

const Services = () => {
  return (
    <section id="services" className="section-bg">
      <div className="container">
        <header className="section-header">
          <h3>Services</h3>
          <p>Laudem latine persequeris id sed, ex fabulas delectus quo. No vel partiendo abhorreant vituperatoribus.</p>
        </header>

        <div className="row">
          <div className="col-md-6 col-lg-5 offset-lg-1 wow bounceInUp" data-wow-duration="1.4s">
            <div className="box">
              <div className="icon">
                <i className="ion-ios-analytics-outline" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h4 className="title" style={{ fontSize: 'var(--subtitle-font)' }}>
                <a href="">Lorem Ipsum</a>
              </h4>
              <p className="description">
                Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-5 wow bounceInUp" data-wow-duration="1.4s">
            <div className="box">
              <div className="icon">
                <i className="ion-ios-bookmarks-outline" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h4 className="title" style={{ fontSize: 'var(--subtitle-font)' }}>
                <a href="">Dolor Sitema</a>
              </h4>
              <p className="description">
                Minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat tarad limino ata
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-5 offset-lg-1 wow bounceInUp" data-wow-delay="0.1s" data-wow-duration="1.4s">
            <div className="box">
              <div className="icon">
                <i className="ion-ios-paper-outline" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h4 className="title" style={{ fontSize: 'var(--subtitle-font)' }}>
                <a href="">Sed ut perspiciatis</a>
              </h4>
              <p className="description">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-5 wow bounceInUp" data-wow-delay="0.1s" data-wow-duration="1.4s">
            <div className="box">
              <div className="icon">
                <i className="ion-ios-speedometer-outline" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h4 className="title" style={{ fontSize: 'var(--subtitle-font)' }}>
                <a href="">Magni Dolores</a>
              </h4>
              <p className="description">
                Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-5 offset-lg-1 wow bounceInUp" data-wow-delay="0.2s" data-wow-duration="1.4s">
            <div className="box">
              <div className="icon">
                <i className="ion-ios-world-outline" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h4 className="title" style={{ fontSize: 'var(--subtitle-font)' }}>
                <a href="">Nemo Enim</a>
              </h4>
              <p className="description">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-5 wow bounceInUp" data-wow-delay="0.2s" data-wow-duration="1.4s">
            <div className="box">
              <div className="icon">
                <i className="ion-ios-clock-outline" style={{ color: 'var(--primary-color)' }}></i>
              </div>
              <h4 className="title" style={{ fontSize: 'var(--subtitle-font)' }}>
                <a href="">Eiusmod Tempor</a>
              </h4>
              <p className="description">
                Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;