import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MinusIcon, PlusIcon } from "lucide-react";
import Image from "next/image";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen w-full relative bg-black">
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
        }}
      />
      <div className="max-w-7xl mx-auto p-20 z-10 relative">
        <div className="flex flex-col gap-10 items-center">
          <section id="header" className="text-center">
            <Badge>
              <Image src="/icons/hand-coins.svg" alt="hand-coins" width={20} height={20} />
              <span className="text-sm font-medium bg-linear-to-r from-[#E59CFF] via-[#BA9CFF] to-[#9CB2FF] text-transparent bg-clip-text">
                Plans and pricing
              </span>
            </Badge>
            <h1 className="text-[40px] font-semibold mt-4">Subscription pricing for all.</h1>
            <p className="text-base font-extralight text-white/80 mt-2">
              Pricing Plans — Yojoies AI Timbre Library (VST)
            </p>
          </section>

          <section id="plans">
            <div className="grid grid-cols-2 gap-12 max-w-3xl mt-4">
              <div
                style={{
                  background:
                    "radial-gradient(ellipse 100% 80% at 10% 0%, hsl(250, 46%, 47%), transparent 100%), #130F1A2E",
                  boxShadow: "-4px 13px 32px 0px #FFFFFF08 inset, 13px 30px 65px 0px #00000066",
                  backdropFilter: "blur(42.29999923706055px)",
                }}
                className="py-14 px-8 rounded-[30px] shadow-2xl shadow-black/40"
              >
                <Stars className="absolute top-0 right-0" />
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">Monthly Plan</h2>
                  <p className="text-sm font-extralight">
                    Flexible monthly subscription with full access to Yojoies AI Timbre Library VST. Cancel anytime.
                  </p>
                  <h3 className="text-4xl font-semibold mt-4">
                    299 THB <span className="text-base font-extralight">/month</span>
                  </h3>
                  <p className="text-sm font-extralight">Flexible monthly access to the VST plugin.</p>
                  <button
                    style={{
                      boxSizing: "border-box",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "12px 14px",
                      gap: "10px",
                      width: "283px",
                      height: "44px",
                      background: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 100%)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                    }}
                    className="my-4 cursor-pointer"
                  >
                    Choose this plan
                  </button>
                  <ul className="flex flex-col gap-2 text-sm font-extralight">
                    <li className="flex flex-row gap-2">
                      <CircleCheck />
                      Full VST access
                    </li>
                    <li className="flex flex-row gap-2">
                      <CircleCheck />
                      All AI-generated timbres
                    </li>
                    <li className="flex flex-row gap-2">
                      <CircleCheck />
                      Regular updates
                    </li>
                  </ul>
                </div>
              </div>
              <div
                style={{
                  background:
                    "radial-gradient(ellipse 100% 80% at 10% 0%, hsl(250, 46%, 47%), transparent 100%), #130F1A2E",
                  boxShadow:
                    "-4px 6px 14.5px 0px rgba(255, 255, 255, 0.05) inset, 9px 6px 65px 0px rgba(50, 50, 50, 0.4)",
                  backdropFilter: "blur(42.29999923706055px)",
                }}
                className="py-14 px-8 rounded-[30px] shadow-2xl shadow-black/40"
              >
                <Stars className="absolute top-0 right-0" />
                <div
                  style={{
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "8px 16px",
                    gap: "8px",
                    position: "absolute",
                    width: "121px",
                    height: "35px",
                    top: "20px",
                    right: "20px",
                    background: "rgba(21, 21, 23, 1)",
                    boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.4)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "32px",
                  }}
                >
                  <span
                    style={{
                      width: "89px",
                      height: "19px",

                      fontFamily: "Inter",
                      fontStyle: "normal",
                      fontWeight: 500,
                      fontSize: "16px",
                      lineHeight: "19px",

                      background: "linear-gradient(90deg, #E759FF 0%, #6174FF 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",

                      flex: "none",
                      order: 0,
                      flexGrow: 0,
                    }}
                  >
                    Saving plan
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-xl font-semibold">Annual Plan</h2>
                  <p className="text-sm font-extralight">
                    Best value for long-term creators and producers. Built for ongoing creation.
                  </p>
                  <h3 className="text-4xl font-semibold mt-4">
                    2,900 THB <span className="text-base font-extralight">/year</span>
                  </h3>
                  <p className="text-sm font-extralight">Best for long-term creators</p>
                  <button
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "12px 14px",
                      gap: "10px",
                      width: "283px",
                      height: "44px",
                      background: "linear-gradient(90deg, rgba(231, 89, 255, 0.8) 0%, rgba(97, 116, 255, 0.8) 100%)",
                      boxShadow: "0px 1px 11.7px 2px rgba(175, 175, 175, 0.3)",
                      borderRadius: "12px",
                    }}
                    className="my-4 cursor-pointer"
                  >
                    Choose this plan
                  </button>
                  <ul className="flex flex-col gap-2 text-sm font-extralight">
                    <li className="flex flex-row gap-2">
                      <CircleCheck />
                      Full VST access
                    </li>
                    <li className="flex flex-row gap-2">
                      <CircleCheck />
                      All AI-generated timbres
                    </li>
                    <li className="flex flex-row gap-2">
                      <CircleCheck />
                      Regular updates
                    </li>
                    <li className="flex flex-row gap-2">
                      <CircleCheck />
                      Save over 15% compared to monthly plan
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section id="question" className="mt-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Badge>
                  <span className="text-sm font-medium bg-linear-to-r from-[#E59CFF] via-[#BA9CFF] to-[#9CB2FF] text-transparent bg-clip-text">
                    Question
                  </span>
                </Badge>
                <h2 className="text-3xl font-semibold text-center mt-4">Frequently Asked Questions (FAQ)</h2>

                <div className="mt-4 flex flex-col gap-4">
                  <QuestionCollapsible
                    defaultOpen={true}
                    title="Q: Why is the system not syncing data?"
                    content="A: Check the Online/Offline status at the top right corner of the app."
                  />
                  <QuestionCollapsible
                    title="Q: I have paid, but my status hasn't changed?"
                    content="A: Check the Payment History page to see if the Admin has received the slip (verification usually takes no more than 24 hours)."
                  />
                  <QuestionCollapsible
                    title="Q: Does Unit/E2E Testing affect the user?"
                    content="A: It does not affect usage, but it guarantees that new feature updates will not have bugs that disrupt your music production."
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function QuestionCollapsible({
  defaultOpen,
  title,
  content,
}: Readonly<{ defaultOpen?: boolean; title: string; content: string }>) {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      className="w-190 bg-[#121212] mix-blend-normal rounded-4xl flex flex-col items-start justify-center py-4.5 px-6"
    >
      <CollapsibleTrigger asChild>
        <button className="flex flex-row items-center justify-between w-full cursor-pointer group">
          <h4 className="text-[18px] font-medium">{title}</h4>
          <PlusIcon className="size-4 ml-auto group-data-[state=open]:hidden" />
          <MinusIcon className="size-4 ml-auto hidden group-data-[state=open]:block" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p className="text-sm font-extralight text-white/40 mt-4">{content}</p>
      </CollapsibleContent>
    </Collapsible>
  );
}

function Badge({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="border border-[#4D2F8C] bg-[#4D2F8C]/20 backdrop-blur-3xl rounded-full px-4 py-1 flex flex-row gap-2 w-fit mx-auto">
      {children}
    </div>
  );
}

function CircleCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.0015 2.77832C8.5731 2.77832 7.17676 3.2019 5.98907 3.99548C4.80138 4.78907 3.87569 5.91703 3.32906 7.23672C2.78243 8.55641 2.6394 10.0086 2.91807 11.4095C3.19674 12.8105 3.88459 14.0974 4.89464 15.1074C5.90469 16.1175 7.19156 16.8053 8.59254 17.084C9.99351 17.3627 11.4457 17.2196 12.7653 16.673C14.085 16.1264 15.213 15.2007 16.0066 14.013C16.8002 12.8253 17.2237 11.429 17.2237 10.0005C17.2217 8.08571 16.4602 6.24988 15.1062 4.89589C13.7522 3.5419 11.9164 2.78034 10.0015 2.77832ZM13.1724 8.72693L9.28347 12.6158C9.23187 12.6675 9.1706 12.7085 9.10316 12.7364C9.03571 12.7644 8.96342 12.7788 8.89041 12.7788C8.8174 12.7788 8.74511 12.7644 8.67767 12.7364C8.61022 12.7085 8.54895 12.6675 8.49735 12.6158L6.83069 10.9492C6.72644 10.8449 6.66788 10.7035 6.66788 10.5561C6.66788 10.4087 6.72644 10.2673 6.83069 10.163C6.93493 10.0588 7.07632 10.0002 7.22374 10.0002C7.37117 10.0002 7.51256 10.0588 7.6168 10.163L8.89041 11.4373L12.3862 7.94082C12.4379 7.8892 12.4991 7.84826 12.5666 7.82032C12.634 7.79239 12.7063 7.77801 12.7793 7.77801C12.8523 7.77801 12.9246 7.79239 12.992 7.82032C13.0595 7.84826 13.1207 7.8892 13.1724 7.94082C13.224 7.99244 13.2649 8.05371 13.2929 8.12116C13.3208 8.1886 13.3352 8.26088 13.3352 8.33388C13.3352 8.40687 13.3208 8.47916 13.2929 8.5466C13.2649 8.61404 13.224 8.67531 13.1724 8.72693Z"
        fill="#FCFCFD"
      />
    </svg>
  );
}

function Stars({ className }: Readonly<{ className?: string }>) {
  return (
    <svg
      width="143"
      height="146"
      viewBox="0 0 143 146"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g opacity="0.8">
        <g opacity="0.9" filter="url(#filter0_d_457_2650)">
          <path
            d="M21.0457 11.1121L20.8224 13.8172C20.8169 13.8792 20.7935 13.9379 20.7555 13.9854C20.7174 14.033 20.6665 14.0671 20.6095 14.0833C20.5526 14.0994 20.4923 14.0967 20.4368 14.0756C20.3813 14.0545 20.3333 14.0159 20.2991 13.9652L18.8257 11.7399L16.263 11.504C16.2043 11.4981 16.1487 11.4735 16.1036 11.4333C16.0585 11.3931 16.0262 11.3394 16.0109 11.2792C15.9957 11.2191 15.9982 11.1555 16.0182 11.0969C16.0382 11.0383 16.0747 10.9876 16.1228 10.9516L18.2307 9.39642L18.454 6.69131C18.4595 6.62933 18.4828 6.57061 18.5209 6.52305C18.5589 6.47549 18.6099 6.44136 18.6668 6.42525C18.7238 6.40914 18.7841 6.41182 18.8396 6.43293C18.895 6.45404 18.9431 6.49257 18.9772 6.54334L20.4521 8.76821L23.0148 9.00414C23.0735 9.00996 23.1291 9.03462 23.1742 9.07479C23.2192 9.11496 23.2516 9.16873 23.2668 9.22886C23.2821 9.289 23.2796 9.35263 23.2596 9.4112C23.2396 9.46976 23.2031 9.52047 23.155 9.5565L21.0457 11.1121Z"
            fill="white"
          />
        </g>
        <g filter="url(#filter1_d_457_2650)">
          <path
            d="M122.838 17.7414L122.114 19.8423C122.098 19.8903 122.067 19.9318 122.027 19.9611C121.987 19.9903 121.94 20.006 121.892 20.006C121.843 20.006 121.796 19.9903 121.756 19.9611C121.716 19.9318 121.685 19.8903 121.669 19.8423L120.946 17.7414L118.956 16.9775C118.91 16.9597 118.871 16.9276 118.843 16.8855C118.816 16.8434 118.801 16.7934 118.801 16.7421C118.801 16.6909 118.816 16.6408 118.843 16.5988C118.871 16.5567 118.91 16.5246 118.956 16.5067L120.946 15.7441L121.67 13.6432C121.687 13.5951 121.717 13.5537 121.757 13.5244C121.797 13.4952 121.844 13.4795 121.893 13.4795C121.941 13.4795 121.989 13.4952 122.028 13.5244C122.068 13.5537 122.099 13.5951 122.116 13.6432L122.839 15.7441L124.83 16.508C124.875 16.5258 124.914 16.5579 124.942 16.6C124.97 16.6421 124.985 16.6921 124.985 16.7434C124.985 16.7946 124.97 16.8447 124.942 16.8867C124.914 16.9288 124.875 16.9609 124.83 16.9788L122.838 17.7414Z"
            fill="white"
          />
        </g>
        <g opacity="0.7" filter="url(#filter2_d_457_2650)">
          <path
            d="M91.893 68.1807L91.9865 69.3143C91.9889 69.3403 91.9986 69.3649 92.0146 69.3848C92.0305 69.4047 92.0519 69.419 92.0757 69.4258C92.0996 69.4325 92.1249 69.4314 92.1481 69.4226C92.1714 69.4137 92.1915 69.3976 92.2058 69.3763L92.8233 68.4437L93.8972 68.3449C93.9218 68.3424 93.9452 68.3321 93.964 68.3153C93.9829 68.2984 93.9965 68.2759 94.0029 68.2507C94.0093 68.2255 94.0082 68.1988 93.9998 68.1743C93.9915 68.1498 93.9762 68.1285 93.956 68.1134L93.0726 67.4617L92.9791 66.3281C92.9768 66.3021 92.967 66.2775 92.951 66.2575C92.9351 66.2376 92.9138 66.2233 92.8899 66.2166C92.866 66.2098 92.8407 66.2109 92.8175 66.2198C92.7942 66.2286 92.7741 66.2448 92.7598 66.266L92.1417 67.1984L91.0678 67.2973C91.0432 67.2997 91.0199 67.3101 91.001 67.3269C90.9821 67.3437 90.9686 67.3663 90.9622 67.3915C90.9558 67.4167 90.9568 67.4433 90.9652 67.4679C90.9736 67.4924 90.9889 67.5137 91.009 67.5288L91.893 68.1807Z"
            fill="white"
          />
        </g>
        <g opacity="0.5" filter="url(#filter3_d_457_2650)">
          <circle cx="44.7688" cy="97.01" r="1.29225" fill="white" />
        </g>
        <g opacity="0.2" filter="url(#filter4_d_457_2650)">
          <circle cx="11.8141" cy="114.456" r="0.646124" fill="white" />
        </g>
        <g filter="url(#filter5_d_457_2650)">
          <circle cx="28.6149" cy="64.0573" r="0.646124" fill="white" />
        </g>
        <g opacity="0.6" filter="url(#filter6_d_457_2650)">
          <circle cx="54.9352" cy="102.826" r="0.646124" fill="white" />
        </g>
        <g filter="url(#filter7_d_457_2650)">
          <circle cx="56.3352" cy="24.6448" r="1.29225" fill="white" />
        </g>
        <g opacity="0.5" filter="url(#filter8_d_457_2650)">
          <circle cx="7.93837" cy="76.9804" r="1.93837" fill="white" />
        </g>
        <g opacity="0.8" filter="url(#filter9_d_457_2650)">
          <circle cx="59.7977" cy="137.717" r="1.93837" fill="white" />
        </g>
        <g opacity="0.5" filter="url(#filter10_d_457_2650)">
          <circle cx="87.9923" cy="3.32144" r="3.23062" fill="white" />
        </g>
        <g opacity="0.2" filter="url(#filter11_d_457_2650)">
          <circle cx="105.981" cy="71.3597" r="1.58626" fill="white" />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_d_457_2650"
          x="8.00098"
          y="-1.58496"
          width="23.2754"
          height="23.6787"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter1_d_457_2650"
          x="110.801"
          y="5.47949"
          width="22.1836"
          height="22.5264"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="4" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter2_d_457_2650"
          x="84.958"
          y="60.2119"
          width="15.0488"
          height="15.2178"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter3_d_457_2650"
          x="37.4766"
          y="89.7178"
          width="14.585"
          height="14.585"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter4_d_457_2650"
          x="5.16797"
          y="107.81"
          width="13.292"
          height="13.292"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter5_d_457_2650"
          x="21.9688"
          y="57.4111"
          width="13.292"
          height="13.292"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter6_d_457_2650"
          x="48.2891"
          y="96.1797"
          width="13.292"
          height="13.292"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter7_d_457_2650"
          x="49.043"
          y="17.3525"
          width="14.585"
          height="14.585"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter8_d_457_2650"
          x="0"
          y="69.042"
          width="15.877"
          height="15.877"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter9_d_457_2650"
          x="51.8594"
          y="129.778"
          width="15.877"
          height="15.877"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter10_d_457_2650"
          x="78.7617"
          y="-5.90918"
          width="18.4609"
          height="18.4609"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
        <filter
          id="filter11_d_457_2650"
          x="98.3945"
          y="63.7734"
          width="15.1729"
          height="15.1729"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_457_2650" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_457_2650" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
