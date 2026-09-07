import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../App";
import { Header } from "../components/layout/Header";
import {
  MapPin,
  Camera,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Check,
  Bus,
  Sparkles,
  Music,
  Image,
} from "lucide-react";
import { KSRTC_DESTINATIONS, BUS_ROUTES, TRAVEL_VIBES, type VehicleType } from "../lib/utils";
import { VehiclePicker } from "../components/VehicleInterior";

type Step = "route" | "vehicle" | "photos" | "details" | "preview";

export function PostTravelPage() {
  const { navigate } = useApp();
  const [step, setStep] = useState<Step>("route");
  const [fromDest, setFromDest] = useState("");
  const [toDest, setToDest] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("");
  const [selectedVibe, setSelectedVibe] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [vehicleType, setVehicleType] = useState<VehicleType>("ksrtc-bus");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const steps: Step[] = ["route", "vehicle", "photos", "details", "preview"];
  const currentStepIndex = steps.indexOf(step);

  const handleAddPhoto = () => {
    // Simulate adding photos (in real app, this would be a file picker)
    const gradients = [
      "linear-gradient(135deg, #4A6741, #8FBC8F)",
      "linear-gradient(135deg, #D4764E, #F4A460)",
      "linear-gradient(135deg, #6B8E5A, #90B06A)",
      "linear-gradient(135deg, #1A1A3E, #4A4A7E)",
      "linear-gradient(135deg, #C41E3A, #E8766B)",
    ];
    setPhotos([...photos, gradients[photos.length % gradients.length]]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsPublished(true);
    }, 2000);
  };

  const canProceed = () => {
    switch (step) {
      case "route":
        return fromDest && toDest && fromDest !== toDest;
      case "photos":
        return photos.length > 0;
      case "details":
        return title.length > 0;
      default:
        return true;
    }
  };

  if (isPublished) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-vintage-parchment flex items-center justify-center"
      >
        <Header />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.5 }}
          className="text-center px-4 pt-20"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-24 h-24 bg-ksrtc-green/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-ksrtc-green" />
          </motion.div>
          <h1 className="font-display text-4xl font-bold text-vintage-ink mb-4">
            Journey Published! 🎉
          </h1>
          <p className="text-vintage-sepia/70 text-lg mb-2">
            Your Anavandi journey is now live
          </p>
          <p className="font-malayalam text-ksrtc-brown/50 mb-8">
            യാത്ര വിജയകരമായി പ്രസിദ്ധീകരിച്ചു!
          </p>
          <div className="flex gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("travel-view", { travelId: "new-travel" })}
              className="px-6 py-3 bg-ksrtc-red text-white rounded-xl font-bold shadow-lg shadow-ksrtc-red/25 flex items-center gap-2"
            >
              <Bus className="w-5 h-5" />
              View Your Journey
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("dashboard")}
              className="px-6 py-3 bg-white border-2 border-ksrtc-cream-dark text-vintage-ink rounded-xl font-bold flex items-center gap-2"
            >
              Back to Dashboard
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-vintage-parchment"
    >
      <Header />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-3xl font-bold text-vintage-ink mb-2">
              Post Your Journey
            </h1>
            <p className="text-vintage-sepia/60">Share your Anavandi travel experience</p>
            <p className="font-malayalam text-sm text-ksrtc-brown/40">നിങ്ങളുടെ യാത്ര പങ്കുവയ്‌ക്കൂ</p>
          </motion.div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: i === currentStepIndex ? 1.1 : 1,
                    backgroundColor: i <= currentStepIndex ? "#C41E3A" : "#E8D5A8",
                  }}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                >
                  {i < currentStepIndex ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <div
                    className={`w-12 h-0.5 ${
                      i < currentStepIndex ? "bg-ksrtc-red" : "bg-ksrtc-cream-dark"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="bg-white rounded-3xl shadow-xl border border-ksrtc-cream-dark overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Step 1: Route Selection */}
              {step === "route" && (
                <motion.div
                  key="route"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <MapPin className="w-6 h-6 text-ksrtc-red" />
                    <h2 className="font-display text-2xl font-bold text-vintage-ink">
                      Select Your Route
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* From */}
                    <div>
                      <label className="block text-sm font-semibold text-vintage-sepia/70 mb-2">
                        Boarding Point
                      </label>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {KSRTC_DESTINATIONS.map((dest) => (
                          <motion.button
                            key={`from-${dest.id}`}
                            whileHover={{ x: 4 }}
                            onClick={() => setFromDest(dest.name)}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                              fromDest === dest.name
                                ? "bg-ksrtc-red/10 border-2 border-ksrtc-red text-ksrtc-red"
                                : "bg-ksrtc-cream/30 border-2 border-transparent hover:border-ksrtc-cream-dark"
                            }`}
                          >
                            <div>
                              <p className="font-medium">{dest.name}</p>
                              <p className="text-xs text-vintage-sepia/50">{dest.zone} Kerala</p>
                            </div>
                            {fromDest === dest.name && (
                              <Check className="w-5 h-5 text-ksrtc-red" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* To */}
                    <div>
                      <label className="block text-sm font-semibold text-vintage-sepia/70 mb-2">
                        Destination
                      </label>
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {KSRTC_DESTINATIONS.filter((d) => d.name !== fromDest).map((dest) => (
                          <motion.button
                            key={`to-${dest.id}`}
                            whileHover={{ x: 4 }}
                            onClick={() => setToDest(dest.name)}
                            className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between transition-all ${
                              toDest === dest.name
                                ? "bg-ksrtc-red/10 border-2 border-ksrtc-red text-ksrtc-red"
                                : "bg-ksrtc-cream/30 border-2 border-transparent hover:border-ksrtc-cream-dark"
                            }`}
                          >
                            <div>
                              <p className="font-medium">{dest.name}</p>
                              <p className="text-xs text-vintage-sepia/50">{dest.zone} Kerala</p>
                            </div>
                            {toDest === dest.name && (
                              <Check className="w-5 h-5 text-ksrtc-red" />
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Route preview */}
                  {fromDest && toDest && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-ksrtc-cream/30 rounded-xl flex items-center justify-center gap-4"
                    >
                      <span className="font-semibold text-vintage-ink">{fromDest}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-px bg-ksrtc-gold" />
                        <Bus className="w-5 h-5 text-ksrtc-red animate-bounce" />
                        <div className="w-8 h-px bg-ksrtc-gold" />
                      </div>
                      <span className="font-semibold text-vintage-ink">{toDest}</span>
                    </motion.div>
                  )}

                  {/* Bus type */}
                  <div className="mt-6">
                    <label className="block text-sm font-semibold text-vintage-sepia/70 mb-3">
                      Bus Type
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {BUS_ROUTES.map((route) => (
                        <button
                          key={route}
                          onClick={() => setSelectedRoute(route)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                            selectedRoute === route
                              ? "bg-ksrtc-red text-white"
                              : "bg-ksrtc-cream/40 text-vintage-sepia/60 hover:bg-ksrtc-cream"
                          }`}
                        >
                          {route}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Vehicle Selection */}
              {step === "vehicle" && (
                <motion.div
                  key="vehicle"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Bus className="w-6 h-6 text-ksrtc-red" />
                    <h2 className="font-display text-2xl font-bold text-vintage-ink">
                      Choose Your Vehicle
                    </h2>
                  </div>
                  <p className="text-vintage-sepia/60 mb-6">
                    Select the vehicle for this journey. The co-traveler view will match your vehicle interior.
                  </p>
                  <VehiclePicker selected={vehicleType} onSelect={setVehicleType} />
                </motion.div>
              )}

              {/* Step 4: Photos */}
              {step === "photos" && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Camera className="w-6 h-6 text-ksrtc-red" />
                    <h2 className="font-display text-2xl font-bold text-vintage-ink">
                      Add Journey Photos
                    </h2>
                  </div>

                  <p className="text-vintage-sepia/60 mb-6">
                    These photos will be shown through the bus windows when co-travelers view your journey.
                  </p>

                  {/* Photo grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    {photos.map((gradient, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="aspect-square rounded-xl overflow-hidden relative group bus-window"
                      >
                        <div className="absolute inset-0" style={{ background: gradient }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Image className="w-10 h-10 text-white/30" />
                        </div>
                        <button
                          onClick={() => removePhoto(i)}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3 text-white" />
                        </button>
                        <div className="absolute bottom-2 left-2 text-xs text-white/70">
                          Photo {i + 1}
                        </div>
                      </motion.div>
                    ))}

                    {/* Add photo button */}
                    {photos.length < 9 && (
                      <motion.button
                        whileHover={{ scale: 1.05, borderStyle: "solid" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddPhoto}
                        className="aspect-square rounded-xl border-2 border-dashed border-ksrtc-cream-dark hover:border-ksrtc-red/30 flex flex-col items-center justify-center gap-2 transition-all"
                      >
                        <Upload className="w-8 h-8 text-vintage-sepia/30" />
                        <span className="text-xs text-vintage-sepia/40">Add Photo</span>
                      </motion.button>
                    )}
                  </div>

                  <p className="text-xs text-vintage-sepia/40">
                    💡 Tip: Capture the view from your window — the scenery, the fellow passengers, the road ahead. {photos.length}/9 photos added.
                  </p>
                </motion.div>
              )}

              {/* Step 5: Details */}
              {step === "details" && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-6 h-6 text-ksrtc-red" />
                    <h2 className="font-display text-2xl font-bold text-vintage-ink">
                      Journey Details
                    </h2>
                  </div>

                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-vintage-sepia/70 mb-2">
                      Journey Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Monsoon Magic on the Western Ghats..."
                      className="w-full px-4 py-3 bg-ksrtc-cream/30 border border-ksrtc-cream-dark rounded-xl text-vintage-ink placeholder-vintage-sepia/30 focus:outline-none focus:ring-2 focus:ring-ksrtc-red/30"
                    />
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-vintage-sepia/70 mb-2">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Tell us about your journey — the sights, sounds, feelings..."
                      rows={4}
                      className="w-full px-4 py-3 bg-ksrtc-cream/30 border border-ksrtc-cream-dark rounded-xl text-vintage-ink placeholder-vintage-sepia/30 focus:outline-none focus:ring-2 focus:ring-ksrtc-red/30 resize-none"
                    />
                  </div>

                  {/* Vibe selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-vintage-sepia/70 mb-3">
                      Journey Vibe
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {TRAVEL_VIBES.map((vibe) => (
                        <motion.button
                          key={vibe}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedVibe(vibe)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedVibe === vibe
                              ? "bg-ksrtc-red text-white shadow-sm"
                              : "bg-ksrtc-cream/50 text-vintage-sepia/60 hover:bg-ksrtc-cream border border-ksrtc-cream-dark"
                          }`}
                        >
                          {vibe}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Music note */}
                  <div className="p-4 bg-ksrtc-gold/10 rounded-xl border border-ksrtc-gold/20">
                    <div className="flex items-center gap-3">
                      <Music className="w-5 h-5 text-ksrtc-gold-dark" />
                      <div>
                        <p className="text-sm font-semibold text-vintage-ink">
                          🎵 Vintage Malayalam Music
                        </p>
                        <p className="text-xs text-vintage-sepia/60">
                          Co-travelers will hear gentle vintage Kerala music while viewing your journey
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 6: Preview */}
              {step === "preview" && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Bus className="w-6 h-6 text-ksrtc-red" />
                    <h2 className="font-display text-2xl font-bold text-vintage-ink">
                      Preview Your Journey
                    </h2>
                  </div>

                  {/* Preview card */}
                  <div className="bg-ksrtc-cream/20 rounded-2xl p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-semibold text-vintage-ink">{fromDest}</span>
                      <ArrowRight className="w-4 h-4 text-ksrtc-gold" />
                      <span className="font-semibold text-vintage-ink">{toDest}</span>
                      {selectedRoute && (
                        <span className="ml-2 px-3 py-1 bg-ksrtc-red/10 text-ksrtc-red text-xs rounded-full">
                          {selectedRoute}
                        </span>
                      )}
                    </div>

                    <h3 className="font-display text-xl font-bold text-vintage-ink mb-2">
                      {title || "Untitled Journey"}
                    </h3>
                    <p className="text-sm text-vintage-sepia/60 mb-4">
                      {description || "No description added"}
                    </p>

                    {selectedVibe && (
                      <span className="inline-block px-3 py-1 bg-ksrtc-cream/50 text-vintage-sepia text-xs rounded-full mb-4">
                        {selectedVibe}
                      </span>
                    )}

                    {/* Photo preview */}
                    <div className="grid grid-cols-3 gap-2">
                      {photos.slice(0, 6).map((gradient, i) => (
                        <div
                          key={i}
                          className="aspect-video rounded-lg"
                          style={{ background: gradient }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="px-8 pb-8 flex justify-between">
              <motion.button
                whileHover={{ x: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const idx = steps.indexOf(step);
                  if (idx > 0) setStep(steps[idx - 1]);
                  else navigate("dashboard");
                }}
                className="px-5 py-2.5 bg-ksrtc-cream/50 text-vintage-sepia rounded-xl font-medium flex items-center gap-2 hover:bg-ksrtc-cream transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                {step === "route" ? "Cancel" : "Back"}
              </motion.button>

              {step === "preview" ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePublish}
                  disabled={isSubmitting}
                  className="px-8 py-2.5 bg-ksrtc-red text-white rounded-xl font-bold shadow-lg shadow-ksrtc-red/25 flex items-center gap-2 hover:bg-ksrtc-red-dark transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      Publish Journey
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    const idx = steps.indexOf(step);
                    if (idx < steps.length - 1) setStep(steps[idx + 1]);
                  }}
                  disabled={!canProceed()}
                  className="px-6 py-2.5 bg-ksrtc-red text-white rounded-xl font-bold shadow-lg shadow-ksrtc-red/25 flex items-center gap-2 hover:bg-ksrtc-red-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
