CREATE TABLE `messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`user_handle` text NOT NULL,
	`created_at` integer DEFAULT current_timestamp
);
