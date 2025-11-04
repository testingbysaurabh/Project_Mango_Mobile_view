import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterPageSkeleton } from "./Loader";
import { readTokenFromLocalStorage, removeTokenFromLocalStorage } from "../Utils/auth";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=2070&q=80",
  "https://images.unsplash.com/photo-1498579809087-ef1e558fd1da?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1542367592-8849eb950fd8?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=400&q=80",
];

const safeImageUrl = (url) => {
  if (!url) return null;
  const trimmed = String(url).trim();
  if (trimmed.startsWith("http://")) return trimmed.replace(/^http:\/\//i, "https://");
  return trimmed;
};

const normalizeItem = (r = {}, idx = 0) => {
  let image = null;
  if (r.logo) image = r.logo;
  else if (r.cover_image) image = r.cover_image;
  else if (r.image) image = r.image;
  else if (Array.isArray(r.images) && r.images.length > 0) {
    const first = r.images[0];
    image = typeof first === "string" ? first : first?.url ?? first?.secure_url ?? null;
  }

  image = safeImageUrl(image) || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length];

  let address = r.address_complete ?? r.restaurant_address ?? r.address ?? "";
  if (address === "null") address = "";
  const id = String(r.restaurant_id ?? r.id ?? `r-${idx}`);

  return {
    id,
    restaurant_id: r.restaurant_id ?? r.id ?? null,
    name: r.restaurant_name ?? r.name ?? "Unknown",
    image,
    address: address || "Address not available",
    short: r.short_description ?? r.description ?? r.about ?? "",
    raw: r,
  };
};

/* Carousel component */
const Carousel = ({ slides = [], onCardClick }) => {
  const [index, setIndex] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (index >= slides.length && slides.length > 0) setIndex(0);
  }, [slides, index]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const child = el.children[index];
    if (child) {
      el.scrollTo({ left: child.offsetLeft - 12, behavior: "smooth" });
    }
  }, [index, slides.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    let startX = 0,
      delta = 0;
    const onStart = (e) => (startX = e.touches ? e.touches[0].clientX : e.clientX);
    const onMove = (e) => (delta = (e.touches ? e.touches[0].clientX : e.clientX) - startX);
    const onEnd = () => {
      if (delta > 50) setIndex((i) => Math.max(0, i - 1));
      else if (delta < -50) setIndex((i) => Math.min(slides.length - 1, i + 1));
      delta = 0;
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onEnd);
    el.addEventListener("mousedown", onStart);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseup", onEnd);
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
      el.removeEventListener("mousedown", onStart);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseup", onEnd);
    };
  }, [slides.length]);

  return (
    <div>
      <div ref={sliderRef} className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-4" style={{ scrollSnapType: "x mandatory" }}>
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="min-w-[260px] w-[260px] rounded-2xl overflow-hidden shadow-lg relative cursor-pointer"
            style={{ transform: i === index ? "scale(1)" : "scale(0.96)", transition: "transform 250ms ease", scrollSnapAlign: "center" }}
            onClick={() => onCardClick && onCardClick(s)}
          >
            <img
              src={s.image}
              alt={s.name}
              className="w-full h-40 object-cover bg-gray-100"
              onError={(e) => {
                const el = e.currentTarget;
                if (el.dataset.failed) return;
                el.dataset.failed = "1";
                el.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
              }}
            />
            <div className="p-3 bg-white">
              <h3 className="font-semibold text-sm truncate">{s.name}</h3>
              <p className="text-xs text-gray-500 truncate">{s.address}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-3">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? "bg-gray-800" : "bg-gray-300"}`} aria-label={`Go to slide ${i + 1}`} />
        ))}
      </div>
    </div>
  );
};

/* BannerSlider */
const BannerSlider = ({ images = [], interval = 3500 }) => {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!images || images.length === 0) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(t);
  }, [images, interval]);

  return (
    <div className="relative w-full h-40 overflow-hidden rounded-xl mt-4 px-4">
      {images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`banner-${i}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
          onError={(e) => {
            const el = e.currentTarget;
            if (el.dataset.failed) return;
            el.dataset.failed = "1";
            el.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
          }}
        />
      ))}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span key={i} className={`w-2 h-2 rounded-full ${i === idx ? "bg-white" : "bg-white/50"}`} />
        ))}
      </div>
    </div>
  );
};




/* ---------- HomeV2 main ---------- */
const HomeV2 = () => {
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const LogOutHandler = () => {
    removeTokenFromLocalStorage();
    navigate('/', { replace: true });
  };

  useEffect(() => {
    let mounted = true;
    async function GetData() {
      setLoading(true);
      setError(null);
      try {
        const token = readTokenFromLocalStorage();
        const res = await axios.get("https://staging.fastor.ai/v1/m/restaurant", {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          params: { city_id: 118 },
          timeout: 10000,
        });

        const raw = res?.data?.data?.results ?? res?.data?.results ?? [];
        const normalized = Array.isArray(raw) ? raw.map((r, i) => normalizeItem(r, i)) : [];
        if (mounted) setRestaurants(normalized);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        if (mounted) setError("Failed to fetch restaurants. Check console for details.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    GetData();
    return () => {
      mounted = false;
    };
  }, []);

  const openProduct = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const slideItems = restaurants.length
    ? restaurants.slice(0, 5)
    : FALLBACK_IMAGES.slice(0, 5).map((img, i) => ({ id: `fallback-${i}`, name: "Suggested", image: img, address: "Connaught Place" }));

  const bannerImgs = FALLBACK_IMAGES.slice(5, 10);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-[375px] h-[812px] bg-white shadow-2xl overflow-auto border border-gray-200 flex flex-col">
        <nav className="p-4 shadow-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Pre Order From <i className="fa-solid fa-location-dot text-[8px]" /></p>
            <p className="font-bold">Connaught Place</p>
          </div>
          <i id="logout" onClick={LogOutHandler} className="fa-solid fa-arrow-right-from-bracket cursor-pointer"></i>
        </nav>

        <div className="p-4">
          <div className="flex gap-3 mb-4">
            <div className="w-1/2 bg-gray-50 rounded-2xl p-4">
              <p className="font-bold text-lg text-gray-500">Hey</p>
              <p className="text-sm font-bold text-gray-900">Let's explore this evening</p>
            </div>

            <div className="w-1/2 flex justify-around items-center">
              <div className="flex flex-col items-center">
                <div className="bg-linear-to-tr from-orange-300 to-orange-500 rounded-2xl p-4 shadow">
                  <i className="fa-solid fa-percent text-white" />
                </div>
                <p className="text-xs mt-2 text-gray-600">Offers</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-linear-to-tr from-sky-300 to-sky-500 rounded-2xl p-4 shadow">
                  <i className="fa-solid fa-wallet text-white" />
                </div>
                <p className="text-xs mt-2 text-gray-600">Wallet</p>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex justify-between items-center mb-2 px-1">
              <h2 className="font-bold text-lg">Your Taste</h2>
            </div>

            {loading && <RegisterPageSkeleton />}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && <Carousel slides={slideItems} onCardClick={openProduct} />}
          </div>

          <BannerSlider images={bannerImgs} interval={3500} />

          <div className="mt-6">
            <h2 className="font-bold mb-4">Popular Ones</h2>
            {loading && <RegisterPageSkeleton />}
            {!loading && !error && restaurants.map((r, i) => (
              <div key={r.id} className="flex items-center gap-4 mb-3 cursor-pointer" onClick={() => openProduct(r)}>
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                  onError={(e) => {
                    const el = e.currentTarget;
                    if (el.dataset.failed) return;
                    el.dataset.failed = "1";
                    el.src = FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];
                  }}
                />
                <div>
                  <h3 className="font-semibold">{r.name}</h3>
                  <p className="text-xs text-gray-500">{r.address}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>★ 4.5</span>
                    <span>•</span>
                    <span>₹{20 * i + 100}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default HomeV2;
