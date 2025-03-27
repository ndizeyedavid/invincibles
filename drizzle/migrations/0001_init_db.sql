CREATE TABLE `amenity` (
	`aminity_id` varchar(20) NOT NULL,
	`name` varchar(244) NOT NULL,
	`aminity_category` varchar(20) NOT NULL,
	CONSTRAINT `amenity_aminity_id` PRIMARY KEY(`aminity_id`)
);
--> statement-breakpoint
CREATE TABLE `aminity_category` (
	`code` varchar(20) NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `aminity_category_code` PRIMARY KEY(`code`)
);
