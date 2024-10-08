const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      username: "JohnDoe",
      userEmail: "johndoe@example.com",
      userPhone: "1234567890",
      userCity: "Colombo",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "JaneSmith",
      userEmail: "janesmith@example.com",
      userPhone: "0987654321",
      userCity: "Kandy",
    },
  });

  // Create Vehicles with image URLs
  const vehicle1 = await prisma.vehicle.create({
    data: {
      contactNo: "1234567890",
      price: 15000,
      brand: "Toyota",
      model: "Corolla",
      year: 2020,
      mileage: 30000,
      gear: "AUTOMATIC",
      fuelType: "PETROL",
      engine: "1.8L",
      details: "Well-maintained Toyota Corolla, only 30k miles",
      posted: true,
      userId: user1.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Toyota+Corolla+5",
    },
  });

  const vehicle2 = await prisma.vehicle.create({
    data: {
      contactNo: "0987654321",
      price: 20000,
      brand: "Honda",
      model: "Civic",
      year: 2018,
      mileage: 50000,
      gear: "MANUAL",
      fuelType: "DIESEL",
      engine: "2.0L",
      details: "Honda Civic in great condition",
      posted: true,
      userId: user2.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Honda+Civic+5",
    },
  });

  // Create Bikes with image URLs
  const bike1 = await prisma.bike.create({
    data: {
      contactNo: "1234567890",
      price: 5000,
      brand: "Yamaha",
      model: "FZ",
      year: 2021,
      mileage: 10000,
      startType: "ELECTRIC",
      bikeType: "FUEL",
      engine: "150cc",
      details: "Yamaha FZ with 10k miles, great condition",
      posted: true,
      userId: user1.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Yamaha+FZ+5",
    },
  });

  const bike2 = await prisma.bike.create({
    data: {
      contactNo: "0987654321",
      price: 4500,
      brand: "Suzuki",
      model: "Gixxer",
      year: 2019,
      mileage: 15000,
      startType: "KICK",
      bikeType: "FUEL",
      engine: "155cc",
      details: "Suzuki Gixxer with 15k miles",
      posted: true,
      userId: user2.userId,
      image1: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+1",
      image2: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+2",
      image3: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+3",
      image4: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+4",
      image5: "https://dummyimage.com/600x400/000/fff&text=Suzuki+Gixxer+5",
    },
  });

  // Create Promoted Items
  await prisma.promotedItem.create({
    data: {
      vehicleId: vehicle1.vehicleId,
      createdAt: new Date(),
    },
  });

  await prisma.promotedItem.create({
    data: {
      bikeId: bike1.bikeId,
      createdAt: new Date(),
    },
  });

  // Create Featured Items
  await prisma.featuredItem.create({
    data: {
      vehicleId: vehicle2.vehicleId,
      createdAt: new Date(),
    },
  });

  await prisma.featuredItem.create({
    data: {
      bikeId: bike2.bikeId,
      createdAt: new Date(),
    },
  });
}

main()
  .then(() => console.log("Seed data with image URLs created!"))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
