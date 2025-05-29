CREATE DATABASE IF NOT EXISTS `carrental` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `carrental`;

CREATE TABLE `cars` (
  `vin` varchar(17) NOT NULL,
  `brand` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `type` varchar(30) DEFAULT NULL,
  `year` int DEFAULT NULL,
  `mileage` int DEFAULT NULL,
  `fuel_type` varchar(20) DEFAULT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `available` tinyint(1) DEFAULT '1',
  `description` text,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cars`
--

INSERT INTO `cars` (`vin`, `brand`, `model`, `type`, `year`, `mileage`, `fuel_type`, `price_per_day`, `available`, `description`, `image_path`) VALUES
('VIN0000000000000', 'Toyota', 'Hilux SR5', 'Pickup', 2020, 47647, 'Diesel', 95.00, 1, 'Tough and reliable dual-cab ute, ideal for work or weekend trips.', 'bxk3mnqhet0fddmtmyu3v3uzf.jpg'),
('VIN0000000000001', 'Audi', 'A1', 'Hatchback', 2023, 59958, 'Diesel', 70.00, 1, 'Compact and stylish urban car, suitable for city driving.', 'car-audi-auto-automotive-38637.jpeg'),
('VIN0000000000002', 'Mini', 'Cooper', 'Hatchback', 2022, 20160, 'Petrol', 65.00, 1, 'Iconic and fun-to-drive small car with sporty handling.', 'mini-cooper-auto-model-vehicle.jpg'),
('VIN0000000000003', 'BMW', '3 Series', 'Sedan', 2020, 27504, 'Petrol', 90.00, 1, 'Luxury sedan with strong performance and elegant design.', 'pexels-photo-100653.jpeg'),
('VIN0000000000004', 'Mercedes-Benz', 'AMG GT', 'Coupe', 2022, 45669, 'Petrol', 150.00, 1, 'High-performance luxury sports coupe from AMG.', 'pexels-photo-112460.jpeg'),
('VIN0000000000005', 'Land Rover', 'Range Rover Evoque', 'SUV', 2022, 23847, 'Diesel', 120.00, 1, 'Compact luxury SUV with off-road capability.', 'pexels-photo-116675.jpeg'),
('VIN0000000000006', 'Volvo', 'XC90', 'SUV', 2021, 18783, 'Petrol', 110.00, 1, 'Spacious 7-seater luxury SUV with advanced safety.', '3e249df647026b8008890d3cff6a9801.jpg'),
('VIN0000000000007', 'Kia', 'Sorento', 'SUV', 2022, 27808, 'Diesel', 85.00, 1, 'Modern SUV with comfort and safety features.', '7bju2kywf7i21m6h27utnnxa8.jpg'),
('VIN0000000000008', 'Ford', 'F-150', 'Pickup', 2022, 35426, 'Diesel', 100.00, 1, 'Full-size pickup truck with powerful presence and comfort.', '70d4unjb0eulfmkbp89rzu4u3.jpg'),
('VIN0000000000009', 'Porsche', 'Macan', 'SUV', 2021, 25410, 'Petrol', 135.00, 1, 'Luxury compact SUV with a sporty edge.', '613uz4qbwjyuwg6mry10m2ht6.jpg'),
('VIN0000000000010', 'Mercedes-Benz', 'SL-Class', 'Convertible', 2020, 55323, 'Petrol', 140.00, 1, 'Elegant two-door convertible with luxury and performance.', 'pexels-photo-136872.jpeg'),
('VIN0000000000011', 'BMW', '3 Series GT', 'Hatchback', 2021, 33837, 'Diesel', 85.00, 1, 'Spacious grand tourer with sleek design and sportiness.', 'pexels-photo-170811.jpeg'),
('VIN0000000000012', 'Mercedes-Benz', 'S-Class Cabriolet AMG', 'Convertible', 2021, 27398, 'Petrol', 160.00, 1, 'AMG-powered luxury convertible with powerful V8 engine.', 'pexels-photo-193021.jpeg'),
('VIN0000000000013', 'Audi', 'A5 Sportback', 'Sedan', 2019, 26733, 'Diesel', 90.00, 1, 'Stylish 4-door sportback with dynamic driving experience.', 'pexels-photo-244206.jpeg'),
('VIN0000000000014', 'Mercedes-Benz', 'A-Class', 'Hatchback', 2020, 48341, 'Petrol', 75.00, 1, 'Sporty and compact luxury hatchback, ideal for urban use.', 'pexels-photo-810357.webp'),
('VIN0000000000015', 'Dodge', 'Viper RT/10', 'Convertible', 2019, 44602, 'Petrol', 150.00, 1, 'Iconic American muscle roadster with raw performance.', 'pexels-photo-831475.jpeg'),
('VIN0000000000016', 'Nissan', '370Z Nismo', 'Coupe', 2022, 31465, 'Hybrid', 95.00, 1, 'Aggressive and stylish sports coupe with track-tuned handling.', 'pexels-photo-905554.webp'),
('VIN0000000000017', 'Audi', 'RS5', 'Coupe', 2023, 21502, 'Petrol', 110.00, 1, 'High-performance coupe with bold styling and quattro grip.', 'pexels-photo-909907.jpeg'),
('VIN0000000000018', 'Jeep', 'Grand Cherokee', 'SUV', 2022, 40889, 'Diesel', 100.00, 1, 'Rugged yet refined SUV for off-road and family driving.', 'pexels-photo-119435.jpeg'),
('VIN0000000000019', 'Mercedes-Benz', 'E-Class', 'Sedan', 2021, 15242, 'Petrol', 105.00, 1, 'Modern executive sedan with cutting-edge technology.', 'pexels-photo-120049.webp'),
('VIN0000000000020', 'Lamborghini', 'Huracan', 'Coupe', 2023, 13946, 'Petrol', 220.00, 1, 'Aggressive Italian supercar with stunning design and V10 power.', 'pexels-photo-3802508.webp'),
('VIN0000000000021', 'Hyundai', 'i30', 'Hatchback', 2022, 27169, 'Petrol', 65.00, 1, 'Practical and affordable compact hatchback.', 'thumb_543018-4954500-img1.jpg'),
('VIN0000000000022', 'Holden', 'Astra', 'Hatchback', 2021, 34250, 'Petrol', 70.00, 1, 'Modern hatchback with great safety and comfort features.', 'thumb_544588-3109579-img1.jpg'),
('VIN0000000000023', 'Mercedes-Benz', 'G63 AMG', 'SUV', 2020, 58941, 'Diesel', 160.00, 1, 'Iconic high-performance luxury SUV with powerful V8 engine.', 'pexels-photo-164654.jpeg'),
('VIN0000000000024', 'Ford', 'Focus', 'Hatchback', 2022, 15958, 'Hybrid', 70.00, 1, 'Reliable and fuel-efficient family hatchback.', 'pexels-photo-1007410.jpeg'),
('VIN0000000000025', 'Audi', 'RS6 Avant', 'Wagon', 2023, 14011, 'Petrol', 120.00, 1, 'High-performance luxury wagon with quattro all-wheel drive.', 'pexels-photo-1035108.jpeg'),
('VIN0000000000026', 'Mercedes-Benz', 'SLK-Class', 'Convertible', 2020, 27327, 'Diesel', 110.00, 1, 'Compact luxury convertible with agile handling.', 'pexels-photo-1335077.jpeg'),
('VIN0000000000027', 'Jeep', 'Wrangler Unlimited', 'SUV', 2021, 60000, 'Petrol', 105.00, 1, 'Trail-rated off-road SUV with rugged style and 4-door versatility.', 'pexels-photo-1638459.jpeg'),
('VIN0000000000028', 'Mercedes-Benz', 'AMG GT R', 'Coupe', 2022, 18024, 'Petrol', 180.00, 1, 'Track-focused sports coupe from AMG with aggressive aero and V8 power.', 'pexels-photo-2365572.jpeg'),
('VIN0000000000029', 'Hyundai', 'Santa Fe', 'SUV', 2021, 32177, 'Diesel', 90.00, 1, 'Family-friendly SUV with modern design and good safety features.', 'pexels-photo-2920064.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `vin` varchar(17) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `license_number` varchar(50) NOT NULL,
  `start_date` date NOT NULL,
  `rental_days` int NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','confirmed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cars`
--
ALTER TABLE `cars`
  ADD PRIMARY KEY (`vin`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vin` (`vin`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`vin`) REFERENCES `cars` (`vin`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
