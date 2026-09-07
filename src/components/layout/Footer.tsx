import { Bus, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-vintage-ink text-vintage-parchment/70 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-ksrtc-red rounded-lg flex items-center justify-center">
                <Bus className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-vintage-parchment">Anavandi Travels</h3>
                <p className="text-xs text-vintage-parchment/40">KSRTC Journey Memories</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              A tribute to the iconic KSRTC Anavandi buses that connect every corner of Kerala. 
              Share your journeys, relive the nostalgia.
            </p>
          </div>

          {/* Routes */}
          <div>
            <h4 className="font-display font-bold text-vintage-parchment mb-4">Popular Routes</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">TVM → CLT (Garuda)</li>
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">ERS → TVM (Rajadhani)</li>
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">QLN → ALP (Ordinary)</li>
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">TCR → WYD (Super Fast)</li>
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">PGT → CAN (Low Floor)</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-bold text-vintage-parchment mb-4">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">All Journeys</li>
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">Monsoon Specials</li>
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">Hill Station Routes</li>
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">Night Services</li>
              <li className="hover:text-ksrtc-gold cursor-pointer transition-colors">About KSRTC</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-vintage-parchment/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-vintage-parchment/30">
            © 2026 Anavandi Travels. A tribute to Kerala's beloved KSRTC.
          </p>
          <p className="text-xs text-vintage-parchment/30 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-ksrtc-red fill-ksrtc-red" /> for Kerala travelers
          </p>
        </div>
      </div>
    </footer>
  );
}
