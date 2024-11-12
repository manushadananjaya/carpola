// import { Metadata } from "next";
// import { Button } from "@/components/ui/button";
// import { Search, Car, DollarSign } from "lucide-react";
// import Link from "next/link";

// import FeaturedCategories from "@/components/FeaturedCategories";

// import Image from "next/image";

// export const metadata: Metadata = {
//   title: "Carpola - Buy and Sell Vehicles in Sri Lanka",
//   description:
//     "Browse thousands of cars from trusted sellers. Buy or sell with ease on Carpola.lk, Sri Lanka's premier online automotive marketplace.",
//   keywords: [
//     "Carpola.lk",
//     "buy cars Sri Lanka",
//     "sell cars Sri Lanka",
//     "vehicle marketplace",
//     "cars for sale",
//     "motorbikes",
//     "vans",
//     "trucks",
//     "Sri Lanka vehicles",
//     "automobiles",
//     "vehicles",
//     "buy vehicles",
//     "Price in Sri Lanka",
//     "car prices in Sri Lanka",
//     "bike prices in Sri Lanka",
//     "truck prices in Sri Lanka",
//     "vehicle prices in Sri Lanka",
//     "Sri Lanka vehicle marketplace",
//     "Sri Lanka vehicle listings",
//     "Sri Lanka vehicle promotions",
//     "toyota cars",
//     "honda cars",
//     "bajaj bikes",
//     "yamaha bikes",
//     "nissan trucks",
//     "mitsubishi trucks",
//     "suzuki vans",
//     "car prices",
//   ],
//   openGraph: {
//     title: "Carpola.lk - Find Your Perfect Ride",
//     description:
//       "Browse thousands of cars from trusted sellers. Buy or sell with ease on Carpola.lk",
//     url: "https://www.carpola.lk",
//     siteName: "Carpola.lk",
//     images: [
//       {
//         url: "https://www.carpola.lk/og-image.jpg",
//         width: 1200,
//         height: 630,
//         alt: "Carpola.lk - Sri Lanka's Premier Automotive Marketplace",
//       },
//     ],
//     locale: "en_US",
//     type: "website",
//   },
//   twitter: {
//     card: "summary_large_image",
//     title: "Carpola.lk - Find Your Perfect Ride",
//     description:
//       "Browse thousands of cars from trusted sellers. Buy or sell with ease on Carpola.lk",
//     images: ["https://www.carpola.lk/twitter-image.jpg"],
//   },
// };

// export default function LandingPage() {
//   return (
//     <div className="flex flex-col min-h-screen">
     
//       <main className="flex-1">
//         <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex justify-center items-center relative overflow-hidden">
//           <Image
//             src="/assets/mainImage.jpg"
//             alt="Background of cars"
//             layout="fill"
//             objectFit="cover"
//             quality={100}
//           />
//           {/* Gradient Overlay */}
//           <div className="absolute inset-0 bg-black/50 z-0"></div>
//           <div className="container px-4 md:px-6 relative z-10">
//             <div className="flex flex-col items-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-lg">
//                   Find Your Perfect Ride
//                 </h1>
//                 <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl drop-shadow-md">
//                   Browse thousands of cars from trusted sellers. Buy or sell
//                   with ease on Carpola.lk
//                 </p>
//               </div>
//               <div className="w-full max-w-sm space-y-2">
//                 <Link href="/search" passHref>
//                   <Button
//                     className="w-full bg-black text-white border hover:text-black hover:bg-gray-200"
//                     size="lg"
//                   >
//                     <Search className="h-4 w-4 mr-2" />
//                     Find Your Vehicle
//                   </Button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 justify-center items-center flex">
//           <div className="container px-4 md:px-6">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
//               Find Your Next Vehicle Today
//             </h2>
//             <FeaturedCategories />
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 justify-center items-center flex">
//           <div className="container px-4 md:px-6">
//             <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8">
//               How It Works
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
//               <div className="flex flex-col items-center">
//                 <Search className="h-12 w-12 mb-4 text-primary" />
//                 <h3 className="text-xl font-bold mb-2">Search</h3>
//                 <p className="text-gray-500">
//                   Browse our extensive catalog of vehicles from trusted sellers.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center">
//                 <Car className="h-12 w-12 mb-4 text-primary" />
//                 <h3 className="text-xl font-bold mb-2">Connect</h3>
//                 <p className="text-gray-500">
//                   Contact sellers directly and schedule test drives.
//                 </p>
//               </div>
//               <div className="flex flex-col items-center">
//                 <DollarSign className="h-12 w-12 mb-4 text-primary" />
//                 <h3 className="text-xl font-bold mb-2">Purchase</h3>
//                 <p className="text-gray-500">
//                   Complete your purchase securely.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </section>
//         <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 flex justify-center items-center">
//           <div className="container px-4 md:px-6">
//             <div className="flex flex-col items-center space-y-4 text-center">
//               <div className="space-y-2">
//                 <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
//                   Ready to Sell Your Vehicle?
//                 </h2>
//                 <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl lg:text-base xl:text-xl">
//                   List your vehicle on AutoMarket and reach thousands of
//                   potential buyers.
//                 </p>
//               </div>
//               <Button className="w-full sm:w-auto" size="lg">
//                 <Link href="/post-ad">List Your Vehicle</Link>
//               </Button>
//             </div>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// }
