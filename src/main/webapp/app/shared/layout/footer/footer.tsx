import './footer.scss';

import React from 'react';

import { Col, Row } from 'reactstrap';

const Footer = () => (
  <div className="footer page-content">
    <Row>
      <Col md="12">
        <p id="footer">Flutter ©2023</p>
      </Col>
    </Row>
  </div>
);

export default Footer;
