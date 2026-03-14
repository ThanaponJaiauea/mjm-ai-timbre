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
import AudioPlayerBar from "../../../../components/timbre-library/Audioplayerbar";
import { useRef } from "react";

export default function TimbreLibraryPage() {
  const [selectedMenu, setSelectedMenu] = useState("All");
  const [trandingData, setTrandingData] = useState(null);
  const [myTimble, setMyTimble] = useState(null);
  const [styleAllData, setStyleAllData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Player state
  const [currentTrack, setCurrentTrack] = useState(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const cachedStateRef = useRef(null);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const resStyle = await get_all_by_type("genre");
        setStyleAllData(resStyle.data);

        const [trending, my] = await Promise.all([
          getTranding({ page: 1 }),
          getMyTimble({ page: 1 }),
        ]);
        setTrandingData(trending.data);
        setMyTimble(my.data);

        setHasMore(trending.data.hasMore || my.data.hasMore || false);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoadPrev = async () => {
    if (page <= 1) return;
    const prevPage = page - 1;
    setPage(prevPage);
    setIsLoadingMore(true);

    try {
      if (selectedMenu === "My Timble") {
        const res = await getMyTimble({ page: prevPage });
        setMyTimble(res.data);
        setHasMore(res.data.hasMore);
      }
      if (selectedMenu === "Trending" || selectedMenu === "ARP") {
        const res = await getTranding({ page: prevPage });
        setTrandingData(res.data);
        setHasMore(res.data.hasMore);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = page + 1;
    setPage(nextPage);

    try {
      if (selectedMenu === "My Timble") {
        const res = await getMyTimble({ page: nextPage });
        setMyTimble(res.data);
        setHasMore(res.data.hasMore);
      }
      if (selectedMenu === "Trending" || selectedMenu === "ARP") {
        const res = await getTranding({ page: nextPage });
        setTrandingData(res.data);
        setHasMore(res.data.hasMore);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingMore(false);
    }
  };

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
      setSearchResults(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSetMenu = (menu) => {
    cachedStateRef.current = {
      myTimble,
      trandingData,
      page: 1,
      hasMore: false,
    };

    setSelectedMenu(menu);
    setSearchQuery("");
    setSearchResults(null);
    setPage(1);
    if (menu === "My Timble") setHasMore(myTimble?.hasMore || false);
    if (menu === "Trending" || menu === "ARP")
      setHasMore(trandingData?.hasMore || false);
  };

  const getData = () => {
    const base = (() => {
      if (selectedMenu === "My Timble") return myTimble;
      if (selectedMenu === "Trending") return trandingData;
      if (selectedMenu === "ARP") return trandingData;
      if (selectedMenu === "BASS") return null;
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

  const handleBack = () => {
    if (cachedStateRef.current) {
      setMyTimble(cachedStateRef.current.myTimble);
      setTrandingData(cachedStateRef.current.trandingData);
      setPage(1);
      setHasMore(false);
      setSearchResults(null);
      cachedStateRef.current = null;
    }
    setSelectedMenu("All");
  };

  return (
    // Add pb-20 when player is active so content isn't hidden behind the bar
    <div
      className={`w-[90%] mx-auto flex flex-col gap-4 min-h-screen text-white ${currentTrack ? "pb-32" : "pb-20"}`}
    >
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
          onPlay={setCurrentTrack}
          currentTrack={currentTrack}
        />
      ) : (
        <LibraryListView
          title={selectedMenu}
          selectedMenu={selectedMenu}
          data={getData()}
          onBack={handleBack}
          styleAllData={styleAllData}
          isSearching={isSearching}
          onStyleSelect={handleStyleSelect}
          onLoadMore={handleLoadMore}
          onLoadPrev={handleLoadPrev}
          hasMore={searchResults ? false : hasMore}
          hasPrev={searchResults ? false : page > 1}
          isLoadingMore={isLoadingMore}
          currentPage={page}
          onPlay={setCurrentTrack}
          currentTrack={currentTrack}
        />
      )}

      {/* Global Audio Player Bar */}
      {currentTrack && (
        <AudioPlayerBar
          track={currentTrack}
          onClose={() => setCurrentTrack(null)}
        />
      )}
    </div>
  );
}
