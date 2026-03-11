"use client";

import { useEffect, useState } from "react";
import {
  getTranding,
  getMyTimble,
  get_all_by_type,
  deleteMyTimble,
} from "@/api/music";
import LibraryListView from "../../../../components/timbre-library/LibraryListView";
import LibraryDashboard from "../../../../components/timbre-library/LibraryDashboard";
import LibraryNavbar from "../../../../components/timbre-library/LibraryNavbar";
import Loading from "../../../../components/loading/Loading";

export default function TimbreLibraryPage() {
  const [selectedMenu, setSelectedMenu] = useState("All");
  const [trandingData, setTrandingData] = useState(null);
  const [myTimble, setMyTimble] = useState(null);
  const [styleAllData, setStyleAllData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resStyle = await get_all_by_type("genre");
        setStyleAllData(resStyle.data);

        const [trending, my] = await Promise.all([
          getTranding(),
          getMyTimble(),
        ]);
        setTrandingData(trending.data);
        setMyTimble(my.data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const getData = () => {
    if (selectedMenu === "My Timble") return myTimble;
    if (selectedMenu === "Trending") return trandingData;
    if (selectedMenu === "ARP") return trandingData;
    if (selectedMenu === "BASS") return;
  };

  if (isLoading) {
    return <Loading />;
  }

  const handleDeleteMyTimble = async (id) => {
    console.log("handleDeleteMyTimble", id);

    try {
      await deleteMyTimble(id);
      const my = await getMyTimble();
      setMyTimble((prev) => ({
        ...prev,
        data: prev.data.filter((item) => item.id !== id),
      }));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  return (
    <div className="w-[90%] mx-auto flex flex-col gap-4 min-h-screen text-white pb-20">
      <div className="text-[40px] font-bold mt-10">Library</div>

      <LibraryNavbar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
      />

      {selectedMenu === "All" ? (
        <LibraryDashboard
          myTimble={myTimble}
          trandingData={trandingData}
          onSeeAll={(menu) => setSelectedMenu(menu)}
          onDelete={(id) => handleDeleteMyTimble(id)}
        />
      ) : (
        <LibraryListView
          title={selectedMenu}
          selectedMenu={selectedMenu}
          data={getData()}
          onBack={() => setSelectedMenu("All")}
          styleAllData={styleAllData}
        />
      )}
    </div>
  );
}
