require("dotenv").config();
const { Client } = require("pg");

const SQL = `
DROP TABLE IF EXISTS items;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE items (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO categories (name, description)
VALUES
('Engine Parts', 'Components related to engine performance and maintenance'),
('Brakes', 'Brake system components including pads, rotors, and fluid'),
('Suspension', 'Shock absorbers, struts, and suspension assemblies'),
('Electrical', 'Battery, alternator, sensors, and wiring components'),
('Tires & Wheels', 'Tires, rims, and wheel accessories'),
('Filters', 'Oil, air, and fuel filtration systems');

INSERT INTO items (name, description, price, quantity, category_id)
VALUES
('Synthetic Engine Oil 5W-30', 'High-performance full synthetic oil', 49.99, 25, 1),
('Spark Plug Set (4-pack)', 'Improves ignition efficiency and fuel economy', 29.99, 40, 1),
('Timing Belt Kit', 'Complete engine timing belt replacement kit', 199.99, 10, 1),
('Air Intake Hose', 'Flexible air intake replacement hose', 34.99, 15, 1);

INSERT INTO items (name, description, price, quantity, category_id)
VALUES
('Front Brake Pads', 'Durable ceramic brake pads', 59.99, 30, 2),
('Brake Rotors (Pair)', 'Ventilated rotors for heat dissipation', 129.99, 20, 2),
('Brake Fluid DOT4', 'High-performance hydraulic brake fluid', 14.99, 50, 2),
('Brake Caliper Kit', 'Complete caliper replacement kit', 179.99, 8, 2);

INSERT INTO items (name, description, price, quantity, category_id)
VALUES
('Shock Absorber', 'Heavy-duty shock absorber for smooth ride', 89.99, 18, 3),
('Strut Assembly Front', 'Complete front suspension strut assembly', 149.99, 12, 3),
('Control Arm', 'Improves wheel alignment and stability', 79.99, 22, 3);

INSERT INTO items (name, description, price, quantity, category_id)
VALUES
('12V Car Battery', 'Reliable automotive battery', 119.99, 15, 4),
('Alternator 140A', 'High-output alternator for modern vehicles', 199.99, 10, 4),
('Oxygen Sensor', 'Monitors exhaust gas for fuel efficiency', 49.99, 35, 4),
('Starter Motor', 'Engine ignition starter motor', 159.99, 9, 4);

INSERT INTO items (name, description, price, quantity, category_id)
VALUES
('All-Season Tire 16"', 'Durable all-season tire for year-round use', 89.99, 60, 5),
('Alloy Wheel 17"', 'Lightweight performance alloy rim', 149.99, 25, 5),
('Wheel Nut Set', 'High-strength wheel fastening nuts', 19.99, 100, 5);

INSERT INTO items (name, description, price, quantity, category_id)
VALUES
('Oil Filter', 'Engine oil filtration system', 9.99, 80, 6),
('Air Filter', 'Engine air intake filter', 12.99, 70, 6),
('Fuel Filter', 'Removes contaminants from fuel system', 19.99, 60, 6);
`;

async function main() {
    const client = new Client ({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.PORT
    });

    await client.connect();
    console.log("Connected. Populating database...");
    await client.query(SQL);
    console.log("Database populated successfully.");
    await client.end();
}

main().catch((err) => {
  console.error("Error populating database:", err);
  process.exit(1);
});