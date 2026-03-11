import AudioLibraryList from "./AudioLibraryList";
import InstrumentCard from "./InstrumentCard";
import TrendingSwiper from "./TrendingSwiper";
import { bg_instrument_Bass, bg_instrument_arp } from "../../../public/index";

export default function LibraryDashboard({
  myTimble,
  trandingData,
  onSeeAll,
  onDelete,
}) {
  return (
    <div className="flex flex-col gap-10 animate-in fade-in duration-500">
      {/* My Timble Section */}
      <section>
        <div className="flex items-center mb-4">
          <span className="text-[24px] font-semibold">My Timble 🎵</span>
          <button
            onClick={() => onSeeAll("My Timble")}
            className="ml-auto text-gray-400 hover:text-white cursor-pointer"
          >
            See All
          </button>
        </div>
        {myTimble ? (
          <AudioLibraryList
            data={myTimble}
            limit={3}
            showTrash={true}
            onDelete={onDelete}
          />
        ) : (
          <p>No data...</p>
        )}
      </section>

      {/* Trending Section */}
      <section className="overflow-hidden">
        <div className="flex items-center mb-6">
          <span className="text-[24px] font-semibold">Trending 🔥</span>
          <button
            onClick={() => onSeeAll("Trending")}
            className="ml-auto text-gray-400 hover:text-white cursor-pointer"
          >
            See All
          </button>
        </div>

        <TrendingSwiper data={trandingData} />
      </section>

      {/* Instruments Section */}
      <section>
        <h2 className="text-[24px] font-semibold mb-6">Instrument 🎹</h2>
        <div className="flex gap-6">
          <InstrumentCard
            title="Arp"
            desc="Rhythmic Synth Patterns"
            bgImage={bg_instrument_arp.src}
            onClick={() => onSeeAll("ARP")}
            gradientClass="bg-gradient-to-bl from-[#292B2C] to-[#6174FF]"
          />

          <InstrumentCard
            title="Bass"
            desc="Deep Low Frequencies"
            bgImage={bg_instrument_Bass.src}
            onClick={() => onSeeAll("BASS")}
            gradientClass="bg-gradient-to-bl from-[#2B2D2C] to-[#D97676]"
          />
        </div>
      </section>
    </div>
  );
}
