// app/components/home/ProductShowcase.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Sparkles, Check, Eye, X, Flame } from 'lucide-react';
import {
  MELTI_PRODUCTS,
  FLAVOR_FILTERS,
  FlavorCategory,
  ProductItem,
} from '@/app/config/productsConfig';
import ArtisanalTinIllustration from './ArtisanalTinIllustration';

const CREAM = '#FFF8F0';
const COCOA = '#1A120B';
const COCOA_DEEP = '#120B06';
const GOLD = '#D4A373';
const GOLD_LIGHT = '#EBC593';

const SHOWCASE_CSS = `
.mps-section {
  position: relative;
  padding: 112px 24px;
  background: radial-gradient(circle at 50% 0%, #241309 0%, ${COCOA_DEEP} 58%, #0D0704 100%);
  color: ${CREAM};
  overflow: hidden;
  border-top: 1px solid rgba(212, 163, 115, 0.14);
}

.mps-container {
  max-width: 1220px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.mps-header {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 48px;
}

.mps-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 16px;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${GOLD_LIGHT};
  background: rgba(212, 163, 115, 0.1);
  border: 1px solid rgba(212, 163, 115, 0.28);
  margin-bottom: 18px;
}

.mps-title {
  font-size: clamp(34px, 5vw, 56px);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: ${CREAM};
  margin: 0;
}

.mps-title-accent {
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 55%, #C86D51 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.mps-subtitle {
  margin-top: 16px;
  font-size: 16px;
  line-height: 1.65;
  color: rgba(235, 197, 147, 0.76);
  font-weight: 500;
}

/* Filter Bar */
.mps-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 52px;
}

.mps-filter-btn {
  padding: 10px 20px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  border: 1px solid rgba(212, 163, 115, 0.22);
  background: rgba(255, 248, 240, 0.03);
  color: rgba(255, 248, 240, 0.8);
  transition: all 0.22s ease;
}

.mps-filter-btn:hover {
  border-color: ${GOLD};
  color: ${GOLD_LIGHT};
  background: rgba(212, 163, 115, 0.1);
}

.mps-filter-btn.active {
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%);
  color: ${COCOA};
  border-color: transparent;
  font-weight: 800;
  box-shadow: 0 8px 24px rgba(212, 163, 115, 0.26);
}

/* 2-Column Editorial Product Grid */
.mps-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 28px;
}

@media (max-width: 960px) {
  .mps-grid {
    grid-template-columns: 1fr;
  }
}

.mps-card {
  position: relative;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 24px;
  padding: 28px;
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(43, 22, 11, 0.85) 0%, rgba(22, 13, 7, 0.95) 100%);
  border: 1px solid rgba(212, 163, 115, 0.18);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 248, 240, 0.08);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.mps-card:hover {
  border-color: rgba(212, 163, 115, 0.48);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(212, 163, 115, 0.08);
}

@media (max-width: 600px) {
  .mps-card {
    grid-template-columns: 1fr;
    padding: 22px;
  }
}

.mps-visual-stage {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: radial-gradient(circle at 50% 55%, rgba(212, 163, 115, 0.08) 0%, rgba(12, 7, 4, 0.7) 100%);
  border: 1px solid rgba(212, 163, 115, 0.12);
  padding: 14px 8px;
  min-height: 255px;
}

.mps-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(18, 11, 6, 0.85);
  color: ${GOLD_LIGHT};
  border: 1px solid rgba(212, 163, 115, 0.35);
  z-index: 4;
}

.mps-inspect-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 6px 11px;
  border-radius: 9999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${CREAM};
  background: rgba(26, 18, 11, 0.85);
  border: 1px solid rgba(255, 248, 240, 0.16);
  cursor: pointer;
  z-index: 4;
  transition: all 0.2s ease;
}

.mps-inspect-btn:hover {
  background: ${GOLD};
  color: ${COCOA};
  border-color: ${GOLD};
}

.mps-card-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.mps-card-tagline {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${GOLD};
  margin-bottom: 4px;
}

.mps-card-title {
  font-size: 24px;
  font-weight: 900;
  color: ${CREAM};
  margin: 0;
  letter-spacing: -0.01em;
}

.mps-card-desc {
  margin-top: 10px;
  font-size: 13.5px;
  line-height: 1.6;
  color: rgba(255, 248, 240, 0.72);
}

/* Tasting Chips */
.mps-notes {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 14px;
}

.mps-note-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 8px;
  background: rgba(212, 163, 115, 0.09);
  border: 1px solid rgba(212, 163, 115, 0.2);
  color: ${GOLD_LIGHT};
}

/* Sensory Mini-Meters */
.mps-meters {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid rgba(212, 163, 115, 0.12);
}

.mps-meter-label {
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(235, 197, 147, 0.7);
  margin-bottom: 5px;
}

.mps-meter-track {
  width: 100%;
  height: 5px;
  border-radius: 9999px;
  background: rgba(255, 248, 240, 0.08);
  overflow: hidden;
}

.mps-meter-fill {
  height: 100%;
  border-radius: 9999px;
  background: linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT});
}

/* Size Selector + Purchase Footer */
.mps-footer {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(212, 163, 115, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.mps-size-toggle {
  display: inline-flex;
  background: rgba(12, 7, 4, 0.8);
  border: 1px solid rgba(212, 163, 115, 0.22);
  border-radius: 10px;
  padding: 3px;
}

.mps-size-opt {
  padding: 5px 10px;
  border-radius: 7px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: transparent;
  color: rgba(255, 248, 240, 0.65);
  transition: all 0.2s ease;
}

.mps-size-opt.selected {
  background: rgba(212, 163, 115, 0.22);
  color: ${GOLD_LIGHT};
}

.mps-price-cta {
  display: flex;
  align-items: center;
  gap: 14px;
}

.mps-price {
  font-size: 22px;
  font-weight: 900;
  color: ${CREAM};
}

.mps-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 20px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  color: ${COCOA};
  background: linear-gradient(135deg, ${GOLD_LIGHT} 0%, ${GOLD} 60%, #B9824F 100%);
  box-shadow: 0 6px 18px rgba(212, 163, 115, 0.24);
  transition: transform 0.15s ease, filter 0.2s ease;
}

.mps-add-btn:hover {
  filter: brightness(1.08);
}

.mps-add-btn:active {
  transform: scale(0.96);
}

.mps-add-btn.added {
  background: #2E6F40;
  color: ${CREAM};
  box-shadow: 0 6px 18px rgba(46, 111, 64, 0.35);
}

/* Quick-Inspect Modal */
.mps-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 10001;
  background: rgba(12, 7, 4, 0.78);
  backdrop-filter: blur(14px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.mps-modal {
  position: relative;
  width: 100%;
  max-width: 540px;
  background: linear-gradient(160deg, #2B160B 0%, #160D07 100%);
  border: 1.5px solid rgba(212, 163, 115, 0.4);
  border-radius: 28px;
  padding: 32px;
  color: ${CREAM};
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.75);
}
`;

export default function ProductShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<FlavorCategory>('all');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, '200g' | '400g'>>({});
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [inspectProduct, setInspectProduct] = useState<ProductItem | null>(null);

  const filteredProducts =
    selectedCategory === 'all'
      ? MELTI_PRODUCTS
      : MELTI_PRODUCTS.filter((p) => p.category === selectedCategory);

  const getSize = (id: string) => selectedSizes[id] || '200g';

  const handleAddToCart = (product: ProductItem) => {
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 1600);
  };

  return (
    <section id="products" className="mps-section">
      <style>{SHOWCASE_CSS}</style>

      <div className="mps-container">
        {/* Section Header */}
        <div className="mps-header">
          <div className="mps-eyebrow">
            <Sparkles size={14} /> Single-Origin Couverture Shavings
          </div>
          <h2 className="mps-title">
            Pick Your <span className="mps-title-accent">Molten Mood.</span>
          </h2>
          <p className="mps-subtitle">
            Real shaved chocolate blocks—never chalky cocoa powder. Filter by intensity, inspect the tasting notes, and pour your ritual.
          </p>
        </div>

        {/* Interactive Mood / Flavour Filter Bar */}
        <div className="mps-filters" role="tablist" aria-label="Filter chocolate blends">
          {FLAVOR_FILTERS.map((filter) => (
            <button
              key={filter.id}
              role="tab"
              aria-selected={selectedCategory === filter.id}
              onClick={() => setSelectedCategory(filter.id)}
              className={`mps-filter-btn ${selectedCategory === filter.id ? 'active' : ''}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 2-Column Editorial Product Grid */}
        <motion.div layout className="mps-grid">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const size = getSize(product.id);
              const activePrice = size === '200g' ? product.price20g : product.price200g;
              const isAdded = !!addedIds[product.id];
              const isHovered = hoveredId === product.id;

              return (
                <motion.article
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="mps-card"
                >
                  {/* Left Visual Stage: Custom Artisanal Tin SVG (or future PNG/WebP) */}
                  <div className="mps-visual-stage">
                    <span className="mps-badge">{product.badge}</span>

                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: '170px',
                          height: '205px',
                          objectFit: 'contain',
                          transition: 'transform 0.35s ease',
                          transform: isHovered ? 'translateY(-6px) scale(1.04)' : 'none',
                        }}
                      />
                    ) : (
                      <ArtisanalTinIllustration
                        cocoaPercent={product.cocoaPercent}
                        accentColor={product.accentColor}
                        labelTint={product.labelTint}
                        categoryLabel={product.category}
                        isHovered={isHovered}
                      />
                    )}

                    <button
                      onClick={() => setInspectProduct(product)}
                      className="mps-inspect-btn"
                      aria-label={`Inspect tasting ritual for ${product.name}`}
                    >
                      <Eye size={12} /> Whisk Ritual
                    </button>
                  </div>

                  {/* Right Details & Controls */}
                  <div className="mps-card-body">
                    <div>
                      <div className="mps-card-tagline">{product.tagline}</div>
                      <h3 className="mps-card-title">{product.name}</h3>
                      <p className="mps-card-desc">{product.description}</p>

                      {/* Tasting Note Pills */}
                      <div className="mps-notes">
                        {product.tastingNotes.map((note) => (
                          <span key={note} className="mps-note-chip">
                            ✦ {note}
                          </span>
                        ))}
                      </div>

                      {/* Sensory Bars */}
                      <div className="mps-meters">
                        <div>
                          <div className="mps-meter-label">
                            <span>Velvet Richness</span>
                            <span>{product.sensory.richness}%</span>
                          </div>
                          <div className="mps-meter-track">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${product.sensory.richness}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="mps-meter-fill"
                            />
                          </div>
                        </div>

                        <div>
                          <div className="mps-meter-label">
                            <span>Sweetness</span>
                            <span>{product.sensory.sweetness}%</span>
                          </div>
                          <div className="mps-meter-track">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${product.sensory.sweetness}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 0.8, ease: 'easeOut' }}
                              className="mps-meter-fill"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Pack Toggle + Price + Add to Bag */}
                    <div className="mps-footer">
                      <div className="mps-size-toggle" role="group" aria-label="Select pack size">
                        <button
                          onClick={() => setSelectedSizes((s) => ({ ...s, [product.id]: '200g' }))}
                          className={`mps-size-opt ${size === '200g' ? 'selected' : ''}`}
                        >
                          200g Tin
                        </button>
                        <button
                          onClick={() => setSelectedSizes((s) => ({ ...s, [product.id]: '400g' }))}
                          className={`mps-size-opt ${size === '400g' ? 'selected' : ''}`}
                        >
                          400g Refill
                        </button>
                      </div>

                      <div className="mps-price-cta">
                        <span className="mps-price">₹{activePrice}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className={`mps-add-btn ${isAdded ? 'added' : ''}`}
                        >
                          {isAdded ? (
                            <>
                              <Check size={15} /> Poured
                            </>
                          ) : (
                            <>
                              <ShoppingBag size={15} /> Add
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Tasting & Whisk Ritual Modal */}
      <AnimatePresence>
        {inspectProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setInspectProduct(null)}
            className="mps-modal-backdrop"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="mps-modal"
            >
              <button
                onClick={() => setInspectProduct(null)}
                aria-label="Close modal"
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '9999px',
                  border: '1px solid rgba(212,163,115,0.3)',
                  background: 'rgba(255,248,240,0.06)',
                  color: CREAM,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={16} />
              </button>

              <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: GOLD }}>
                Single-Origin Dossier • {inspectProduct.cocoaPercent} Cocoa
              </div>
              <h3 style={{ fontSize: '28px', fontWeight: 900, marginTop: '6px', marginBottom: '8px' }}>
                {inspectProduct.name}
              </h3>
              <p style={{ fontSize: '14px', color: 'rgba(255,248,240,0.75)', lineHeight: 1.6 }}>
                {inspectProduct.description}
              </p>

              <div
                style={{
                  marginTop: '20px',
                  padding: '16px',
                  borderRadius: '16px',
                  background: 'rgba(12, 7, 4, 0.7)',
                  border: '1px solid rgba(212, 163, 115, 0.2)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800, color: GOLD_LIGHT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  <Flame size={15} /> The Perfect Whisk Ritual
                </div>
                <p style={{ marginTop: '8px', fontSize: '13.5px', color: CREAM, lineHeight: 1.55 }}>
                  {inspectProduct.ritualTip}
                </p>
                <div style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(235, 197, 147, 0.75)' }}>
                  <strong>Bean Provenance:</strong> {inspectProduct.origin}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => {
                    handleAddToCart(inspectProduct);
                    setInspectProduct(null);
                  }}
                  className="mps-add-btn"
                >
                  <ShoppingBag size={15} /> Add 200g Tin — ₹{inspectProduct.price200g}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}