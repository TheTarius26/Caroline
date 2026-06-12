CREATE TABLE "collaborator" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"username" text NOT NULL,
	"repository" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "project" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"collaborators" text DEFAULT '[]' NOT NULL,
	"total_collaborators" integer DEFAULT 0 NOT NULL,
	"active_collaborators" integer DEFAULT 0 NOT NULL,
	"completed_collaborators" integer DEFAULT 0 NOT NULL,
	"completion_percentage" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
