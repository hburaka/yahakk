CREATE TABLE `custom_zikir` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`arabic` text,
	`transliteration` text,
	`meaning` text,
	`default_count` integer DEFAULT 33 NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`kind` text NOT NULL,
	`item_id` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	PRIMARY KEY(`kind`, `item_id`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`region` text,
	`country_code` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`timezone` text NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `prayer_times` (
	`location_id` text NOT NULL,
	`date` text NOT NULL,
	`fajr` integer NOT NULL,
	`sunrise` integer NOT NULL,
	`dhuhr` integer NOT NULL,
	`asr` integer NOT NULL,
	`maghrib` integer NOT NULL,
	`isha` integer NOT NULL,
	`asr_hanafi` integer,
	`source` text NOT NULL,
	PRIMARY KEY(`location_id`, `date`),
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `prayer_times_date_idx` ON `prayer_times` (`date`);--> statement-breakpoint
CREATE TABLE `zikir_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text,
	`custom_zikir_id` text,
	`set_id` text,
	`set_step_index` integer,
	`target_count` integer NOT NULL,
	`current_count` integer DEFAULT 0 NOT NULL,
	`status` text NOT NULL,
	`date` text NOT NULL,
	`started_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	`completed_at` integer,
	FOREIGN KEY (`custom_zikir_id`) REFERENCES `custom_zikir`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `zikir_sessions_status_idx` ON `zikir_sessions` (`status`);--> statement-breakpoint
CREATE INDEX `zikir_sessions_date_idx` ON `zikir_sessions` (`date`);