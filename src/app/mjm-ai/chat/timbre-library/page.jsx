"use client";

import { useEffect, useState } from "react";
import {
  getTranding,
  getMyTimble,
  get_all_by_type,
  deleteMyTimble,
  search,
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

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

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

  // source map ตาม selectedMenu
  const getSource = () => {
    if (selectedMenu === "My Timble") return "my";
    if (selectedMenu === "Trending") return "trending";
    if (selectedMenu === "ARP") return "arp";
    return null;
  };

  const handleSearch = async (q) => {
    const src = getSource();
    if (!src) return;

    if (!q.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const res = await search({ q, source: src });
      console.log("handleSearch:", res.data.data);

      setSearchResults(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSetMenu = (menu) => {
    setSelectedMenu(menu);
    setSearchQuery("");
    setSearchResults(null);
  };

  const getData = () => {
    const base = (() => {
      if (selectedMenu === "My Timble") return myTimble;
      if (selectedMenu === "Trending") return trandingData;
      if (selectedMenu === "ARP") return trandingData;
    })();

    if (searchResults !== null) {
      return { ...base, data: searchResults };
    }
    return base;
  };

  if (isLoading) {
    return <Loading />;
  }

  const handleDeleteMyTimble = async (id) => {
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

  const handleStyleSelect = async (styleName) => {
    const src = getSource();
    if (!src) return;

    // clear → แสดง data เดิม
    if (!styleName) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const res = await search({ style_name: styleName, source: src });

      setSearchResults(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-[90%] mx-auto flex flex-col gap-4 min-h-screen text-white pb-20">
      <div className="text-[40px] font-bold mt-10">Library</div>

      <LibraryNavbar
        selectedMenu={selectedMenu}
        setSelectedMenu={setSelectedMenu}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearch={handleSearch}
      />

      {selectedMenu === "All" ? (
        <LibraryDashboard
          myTimble={myTimble}
          trandingData={trandingData}
          onSeeAll={handleSetMenu}
          onDelete={handleDeleteMyTimble}
        />
      ) : (
        <LibraryListView
          title={selectedMenu}
          selectedMenu={selectedMenu}
          data={getData()}
          onBack={() => setSelectedMenu("All")}
          styleAllData={styleAllData}
          isSearching={isSearching}
          onStyleSelect={handleStyleSelect}
        />
      )}
    </div>
  );
}
