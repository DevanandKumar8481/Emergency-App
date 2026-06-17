import React, { useState } from "react";
import { Home, Search, MapPin, Star, CheckCircle, AlertCircle } from "lucide-react";


const Shelter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

  const config = {
    title: "Live Shelter Availability",
    sub: "Relief camps, community halls and verified host families with open beds tonight.",
    icon: Home,
    searchPlaceholder: "Search shelter, camp or host...",
    filterChips: ["Family", "Women only", "Children", "Senior care", "Pet-friendly", "Accessible"],
    unitLabel: "beds free",
    critical: {
      title: "Fire evacuation · 26 displaced from Govindpuri need shelter tonight",
      meta: "Need family + senior-friendly beds within 3 km",
      cta: "Offer space",
    },
    items: [
      {
        name: "Indira Gandhi Community Hall",
        meta: "Govt. relief camp · Hot food + bedding",
        distanceKm: 2.1,
        available: 38,
        capacity: 120,
        unit: "beds",
        rating: 4.6,
        verified: true,
        status: "live",
        tags: ["Family", "Children", "Accessible"],
      },
      {
        name: "Sakhi Home — Women & Children",
        meta: "Staffed 24×7 · Counselor on site",
        distanceKm: 3.4,
        available: 12,
        capacity: 30,
        unit: "beds",
        rating: 4.9,
        verified: true,
        status: "live",
        tags: ["Women only", "Children"],
      },
      {
        name: "St. Mary's School (relief mode)",
        meta: "Auditorium · Power backup + medical post",
        distanceKm: 1.6,
        available: 80,
        capacity: 200,
        unit: "beds",
        rating: 4.7,
        verified: true,
        status: "live",
        tags: ["Family", "Pet-friendly"],
      },
      {
        name: "Verified host · Mehra family",
        meta: "1 room + bath · 1 week max · Vegetarian home",
        distanceKm: 0.9,
        available: 3,
        unit: "beds",
        rating: 5.0,
        verified: true,
        status: "live",
        tags: ["Family", "Senior care"],
        eta: "15 min",
      },
      {
        name: "Old Age Care Centre · HelpAge",
        meta: "Senior medical care + physiotherapy",
        distanceKm: 4.7,
        available: 4,
        capacity: 25,
        unit: "beds",
        rating: 4.8,
        verified: true,
        status: "low",
        tags: ["Senior care", "Accessible"],
      },
    ],
    stats: [
      { label: "Shelters live", value: "18", tone: "ok" },
      { label: "Beds free", value: "412", tone: "ok" },
      { label: "Urgent needs", value: "3", tone: "bad" },
      { label: "Sheltered today", value: "1,247" },
    ],
    tips: [
      { title: "Verified hosts", body: "All host families pass background + address verification." },
      { title: "Stay duration", body: "Standard stay is 72 hours, extendable based on situation." },
      { title: "Bring essentials", body: "Carry ID, medicines and one change of clothes if possible." },
    ],
  };

  const filteredItems = config.items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meta.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => item.tags.includes(filter));
    return matchesSearch && matchesFilter;
  });

  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const darkStyles = `
  .availability-container {
    background: #0a0a0f;
    color: #e8e8f0;
    min-height: 100vh;
    font-family: system-ui, -apple-system, sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 24px;
  }
  .header { margin-bottom: 24px; }
  .header h1 { font-size: 28px; font-weight: 800; color: #f0f0f8; margin: 0 0 6px; }
  .subtitle { color: rgba(232,232,240,0.55); font-size: 14px; margin: 0; }

  .critical-alert {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    background: rgba(229,62,62,0.12);
    border: 1px solid rgba(229,62,62,0.35);
    border-radius: 16px; padding: 18px 22px; margin-bottom: 24px;
  }
  .critical-icon { color: #f56565; flex-shrink: 0; width: 24px; height: 24px; }
  .critical-content { flex: 1; min-width: 200px; }
  .critical-content h3 { font-size: 15px; font-weight: 700; color: #f56565; margin: 0 0 4px; }
  .critical-content p  { font-size: 13px; color: rgba(232,232,240,0.55); margin: 0; }
  .cta-button {
    background: linear-gradient(135deg,#e53e3e,#c53030);
    color: #fff; border: none; padding: 10px 20px;
    border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer;
  }

  .stats-grid {
    display: grid; grid-template-columns: repeat(auto-fit, minmax(130px,1fr));
    gap: 12px; margin-bottom: 24px;
  }
  .stat-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 16px; padding: 16px 18px;
  }
  .stat-label { font-size: 11px; color: rgba(232,232,240,0.45); margin: 0 0 6px; }
  .stat-value { font-size: 26px; font-weight: 800; color: #e8e8f0; margin: 0; }
  .stat-ok   .stat-value { color: #4ade80; }
  .stat-bad  .stat-value { color: #f87171; }
  .stat-warn .stat-value { color: #fbbf24; }

  .search-section { margin-bottom: 24px; }
  .search-box {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px; padding: 10px 16px; margin-bottom: 14px;
    color: rgba(232,232,240,0.5);
  }
  .search-box input {
    background: transparent; border: none; outline: none;
    color: #e8e8f0; font-size: 14px; flex: 1;
  }
  .search-box input::placeholder { color: rgba(232,232,240,0.35); }
  .filters { display: flex; flex-wrap: wrap; gap: 8px; }
  .filter-chip {
    padding: 6px 14px; border-radius: 99px; font-size: 13px; font-weight: 600;
    border: 1.5px solid rgba(255,255,255,0.15);
    background: transparent; color: rgba(232,232,240,0.7); cursor: pointer;
    transition: all 0.15s;
  }
  .filter-chip.active {
    background: #e53e3e; border-color: #e53e3e; color: #fff;
  }

  .items-section { margin-bottom: 32px; }
  .items-count { font-size: 13px; color: rgba(232,232,240,0.4); margin-bottom: 14px; }
  .items-list { display: flex; flex-direction: column; gap: 12px; }

  .item-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 18px; padding: 20px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .item-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
  .item-card.status-low  { border-color: rgba(251,191,36,0.35); }
  .item-card.status-live { border-color: rgba(74,222,128,0.2); }

  .item-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 8px; gap: 12px;
  }
  .item-title-section { display: flex; align-items: center; gap: 8px; }
  .item-title-section h3 { font-size: 15px; font-weight: 700; color: #f0f0f8; margin: 0; }
  .verified-badge { color: #4ade80; flex-shrink: 0; }
  .item-distance {
    display: flex; align-items: center; gap: 4px;
    font-size: 12px; color: rgba(232,232,240,0.45); white-space: nowrap;
  }
  .item-meta { font-size: 12px; color: rgba(232,232,240,0.5); margin: 0 0 10px; }

  .item-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .tag {
    font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 99px;
    background: rgba(229,62,62,0.15); color: #f87171;
  }

  .item-footer {
    display: flex; align-items: center; gap: 16px;
    margin-bottom: 14px; flex-wrap: wrap;
  }
  .available-count { font-size: 15px; font-weight: 700; color: #4ade80; }
  .capacity { font-size: 12px; color: rgba(232,232,240,0.4); }
  .item-rating { display: flex; align-items: center; gap: 4px; font-size: 13px; color: #fbbf24; }
  .star { color: #fbbf24; }
  .eta {
    font-size: 12px; font-weight: 600; color: #60a5fa;
    background: rgba(96,165,250,0.12); padding: 3px 10px; border-radius: 99px;
  }

  .request-button {
    width: 100%; padding: 11px 0; border-radius: 10px; border: none;
    background: linear-gradient(135deg,#e53e3e,#c53030);
    color: #fff; font-size: 14px; font-weight: 700; cursor: pointer;
    transition: opacity 0.2s;
  }
  .request-button:hover { opacity: 0.88; }

  .tips-section h2 { font-size: 18px; font-weight: 700; color: #f0f0f8; margin: 0 0 16px; }
  .tips-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap: 12px; }
  .tip-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px; padding: 16px;
  }
  .tip-card h4 { font-size: 13px; font-weight: 700; color: #e8e8f0; margin: 0 0 6px; }
  .tip-card p  { font-size: 12px; color: rgba(232,232,240,0.5); line-height: 1.6; margin: 0; }
`;

  return (
    <>
      <style>{darkStyles}</style>
      <div className="availability-container">
        <header className="header">
          <div className="header-content">
            <h1>{config.title}</h1>
            <p className="subtitle">{config.sub}</p>
          </div>
        </header>

        {/* Critical Alert */}
        <section className="critical-alert">
          <AlertCircle className="critical-icon" />
          <div className="critical-content">
            <h3>{config.critical.title}</h3>
            <p>{config.critical.meta}</p>
          </div>
          <button className="cta-button">{config.critical.cta}</button>
        </section>

        {/* Stats */}
        <section className="stats-grid">
          {config.stats.map((stat, idx) => (
            <div key={idx} className={`stat-card stat-${stat.tone || "default"}`}>
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </section>

        {/* Search & Filters */}
        <section className="search-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder={config.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filters">
            {config.filterChips.map((chip) => (
              <button
                key={chip}
                className={`filter-chip ${selectedFilters.includes(chip) ? "active" : ""}`}
                onClick={() => toggleFilter(chip)}
              >
                {chip}
              </button>
            ))}
          </div>
        </section>

        {/* Items List */}
        <section className="items-section">
          <div className="items-count">
            Showing {filteredItems.length} of {config.items.length} shelters
          </div>

          <div className="items-list">
            {filteredItems.map((item, idx) => (
              <div key={idx} className={`item-card status-${item.status}`}>
                <div className="item-header">
                  <div className="item-title-section">
                    <h3>{item.name}</h3>
                    {item.verified && <CheckCircle size={16} className="verified-badge" />}
                  </div>
                  <div className="item-distance">
                    <MapPin size={16} />
                    {item.distanceKm} km
                  </div>
                </div>

                <p className="item-meta">{item.meta}</p>

                <div className="item-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="item-footer">
                  <div className="item-availability">
                    <span className="available-count">
                      {item.available} {item.unit}
                    </span>
                    {item.capacity && (
                      <span className="capacity">
                        / {item.capacity} total
                      </span>
                    )}
                  </div>

                  <div className="item-rating">
                    <Star size={16} className="star" />
                    <span>{item.rating}</span>
                  </div>

                  {item.eta && <span className="eta">{item.eta}</span>}
                </div>

                <button className="request-button">Request Space</button>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="tips-section">
          <h2>Quick Tips</h2>
          <div className="tips-grid">
            {config.tips.map((tip, idx) => (
              <div key={idx} className="tip-card">
                <h4>{tip.title}</h4>
                <p>{tip.body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>);
};

export default Shelter;
