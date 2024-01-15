import React, { useEffect } from "react";
import "./homepage.css";
import { useRouter } from "next/navigation";

const HomepageForm = () => {
  const router = useRouter();

  return (
    <>
      <div class="container">
        <h1 class="h1-homepage">GloEvents</h1>
        <p>
          Transforming ideas into unforgettable events - your vision, our
          expertise. Elevate your occasions with precision planning and flawless
          execution.
        </p>
        <button
          className="register-redirect"
          onClick={() => {
            router.push("/");
          }}
        >
          Find more
        </button>
      </div>
      <div class="blank"></div>
      <div class="container second">
        <div class="item">
          <div class="img img-first"></div>
          <div class="card">
            <h3 class="h3-homepage">Enchanted Garden Gala</h3>
            <p class="p-homepage">
              A whimsical evening in an ethereal setting, filled with magical
              ambiance and captivating performances. Join us for an
              unforgettable night under the stars.
            </p>
            <button className="register-redirect">Go to event</button>
          </div>
        </div>
        <div class="item">
          <div class="img img-second"></div>
          <div class="card">
            <h3 class="h3-homepage">Unveiling innovations</h3>
            <p class="p-homepage">
              A whimsical evening in an ethereal setting, filled with magical
              ambiance and captivating performances. Join us for an
              unforgettable night under the stars.
            </p>
            <button className="register-redirect">Go to event</button>
          </div>
        </div>
        <div class="item">
          <div class="img img-third"></div>
          <div class="card">
            <h3 class="h3-homepage">Harmony & rhytm</h3>
            <p class="p-homepage">
              A whimsical evening in an ethereal setting, filled with magical
              ambiance and captivating performances. Join us for an
              unforgettable night under the stars.
            </p>
            <button className="register-redirect">Go to event</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomepageForm;
