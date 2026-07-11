import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DISHES, DISH_BY_ID, costPerServing, kcalLabel } from '../data/dishes';
import { useStore } from '../data/store';
import FoodMap from '../components/FoodMap';
import Pic from '../components/Pic';
import { useReveal } from '../lib/reveal';
import '../styles/landing.css';

const HERO_IDS = ['lasagna', 'burger', 'tacos', 'greek-salad'];

export default function Landing() {
  const navigate = useNavigate();
  const addKitchen = useStore((s) => s.addKitchen);
  const [heroId, setHeroId] = useState('lasagna');
  const [replay, setReplay] = useState(0);
  const hero = DISH_BY_ID[heroId];
  useReveal([]);

  const useWhatIHave = () => {
    addKitchen(
      hero.pins.filter((p) => p.kind !== 'garnish').map((p) => p.label.split(',')[0]),
      'map'
    );
    navigate('/kitchen');
  };

  return (
    <div>
      <a href="#main" className="skip-link">Skip to content</a>
      <nav className="nav" aria-label="Primary">
        <Link to="/" className="wordmark">Dish<i>covery</i></Link>
        <Link to="/lens" className="act act--signal">Open the Lens</Link>
      </nav>

      {/* HERO — the product, demonstrated on frame one */}
      <header className="hero" id="main" tabIndex={-1}>
        <div className="hero__map">
          <FoodMap dish={hero} eager lens replayKey={replay} />
        </div>
        <div className="hero__body frame">
          <p className="sample-tag">Sample plate — simulated analysis</p>
          <h1 className="serif hero__title" style={{ marginTop: '0.9rem' }}>
            Your food, <span className="sig">annotated.</span>
          </h1>
          <p className="hero__sub">
            Point Dishcovery at any plate. It reads the photograph, maps every
            ingredient with honest confidence, and turns dinner you saw into
            dinner you make.
          </p>
          <div className="hero__acts">
            <Link to={`/map/${hero.slug}`} className="act act--signal">Recreate this</Link>
            <button className="act" onClick={useWhatIHave}>Use what I have</button>
            <Link to="/plan" className="act">Plan my week</Link>
            <Link to={`/cookspace/${hero.slug}`} className="act">Cook it now</Link>
          </div>
          <div className="hero__meta">
            <div className="switcher" role="group" aria-label="Choose a sample plate">
              {HERO_IDS.map((id) => (
                <button
                  key={id}
                  aria-pressed={heroId === id}
                  aria-label={`Map ${DISH_BY_ID[id].title}`}
                  onClick={() => {
                    setHeroId(id);
                    setReplay((r) => r + 1);
                  }}
                >
                  <img src={DISH_BY_ID[id].photo.lqip} alt="" width={52} height={52} />
                </button>
              ))}
            </div>
            <span className="caps caps--dim">No signup · live sample above</span>
          </div>
        </div>
      </header>

      {/* Journey strip */}
      <div className="journey" aria-label="The Dishcovery journey">
        {['Lens', 'Food Map', 'Recreate', 'Plan', 'Kitchen', 'Cookspace'].map((s, i, a) => (
          <span key={s}>
            <span className={`caps ${i === 1 ? 'hot' : ''}`}>{s}</span>
            {i < a.length - 1 && <span className="tick">→</span>}
          </span>
        ))}
      </div>

      {/* Chapters */}
      <section className="frame chapter">
        <div className="chapter__media rv">
          <FoodMap dish={DISH_BY_ID.burger} />
        </div>
        <div className="chapter__copy rv">
          <span className="chapter__no">01 · THE LENS READS</span>
          <h2 className="serif chapter__title">Every plate becomes a map.</h2>
          <p className="chapter__body">
            Brioche, beefsteak tomato, double smashed patty — each detection is
            pinned to the photograph itself, labeled in plain language, and
            scored with the confidence we actually have. Tap any pin to correct
            us. The map is yours.
          </p>
          <div className="chapter__stat">
            <span><b>{DISH_BY_ID.burger.pins.length}</b><small>detections</small></span>
            <span><b>{Math.max(...DISH_BY_ID.burger.pins.map((p) => p.conf))}%</b><small>top confidence</small></span>
            <span><b>1 tap</b><small>to correct</small></span>
          </div>
        </div>
      </section>

      <section className="frame chapter chapter--flip">
        <div className="chapter__media rv">
          <Pic photo={DISH_BY_ID.tacos.photo} alt="Street tacos al pastor, close photograph" />
        </div>
        <div className="chapter__copy rv">
          <span className="chapter__no">02 · THE MAP COOKS</span>
          <h2 className="serif chapter__title">From photograph to grocery math.</h2>
          <p className="chapter__body">
            The map becomes a recipe rebuilt for a home kitchen — costed per
            serving, timed honestly, scaled to your table. Restaurant tacos:
            $19 a plate. This map: ${costPerServing(DISH_BY_ID.tacos).toFixed(2)} a serving.
          </p>
          <div className="chapter__stat">
            <span><b>${costPerServing(DISH_BY_ID.tacos).toFixed(2)}</b><small>per serving</small></span>
            <span><b>{DISH_BY_ID.tacos.minutes}m</b><small>to the table</small></span>
            <span><b>{kcalLabel(DISH_BY_ID.tacos)}</b><small>kcal, honest range</small></span>
          </div>
        </div>
      </section>

      <section className="frame chapter">
        <div className="chapter__media rv">
          <Pic photo={DISH_BY_ID.teriyaki.photo} alt="Sesame teriyaki bowl photograph" />
        </div>
        <div className="chapter__copy rv">
          <span className="chapter__no">03 · THE KITCHEN RUNS</span>
          <h2 className="serif chapter__title">Plan the week. Cook hands-free.</h2>
          <p className="chapter__body">
            Maps flow into a weekly plan, the plan knows what your kitchen
            already holds, and Cookspace walks each step full-screen with
            timers — built for greasy hands and busy stoves.
          </p>
          <div className="chapter__stat">
            <span><b>7</b><small>dinners planned</small></span>
            <span><b>0</b><small>tabs while cooking</small></span>
          </div>
        </div>
      </section>

      {/* Honesty */}
      <section className="honesty">
        <div className="frame">
          <h2 className="serif rv">We show our uncertainty. On purpose.</h2>
          <p className="rv">
            Reading food from a photograph is hard, and anyone who gives you a
            single perfect number is guessing. Dishcovery gives ranges, shows a
            confidence for every detection, and lets you correct the map in one
            tap. Sample data here is labeled as sample data — always.
          </p>
          <div className="conf-row rv">
            <span className="conf-chip"><i style={{ background: 'var(--leaf)' }} /> 85–100 · high</span>
            <span className="conf-chip"><i style={{ background: 'var(--amber)' }} /> 70–84 · medium</span>
            <span className="conf-chip"><i style={{ background: 'var(--signal)' }} /> below 70 · we say so</span>
            <span className="conf-chip">every pin · editable</span>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="gallery frame">
        <div className="rv">
          <span className="chapter__no">THE ARCHIVE</span>
          <h2 className="serif chapter__title" style={{ maxWidth: '16ch' }}>
            Fourteen plates, already mapped.
          </h2>
        </div>
        <div className="gallery__grid">
          {DISHES.map((x) => (
            <Link key={x.id} to={`/map/${x.slug}`} className="gcard rv" aria-label={`Open the Food Map for ${x.title}`}>
              <Pic photo={x.photo} alt="" />
              <span className="gcard__veil" />
              <span className="gcard__meta">
                <span className="gcard__name">{x.title}</span>
                <span className="gcard__data num">{kcalLabel(x)} kcal · ${costPerServing(x).toFixed(2)}/sv</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="footer">
        <span>© 2026 Dishcovery — food intelligence for real kitchens.</span>
        <span>All analysis on this site is simulated sample data, labeled as such.</span>
        <span>Photography: Pexels license. <Link to="/lens">Open the Lens</Link></span>
      </footer>
    </div>
  );
}
