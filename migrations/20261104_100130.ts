import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_admin_invitations_role" AS ENUM('admin', 'user');
  CREATE TYPE "public"."enum_comments_target_type" AS ENUM('product', 'post');
  CREATE TYPE "public"."enum_notifications_type" AS ENUM('COMMENT', 'POST', 'REPLY', 'PAID', 'DELIVERED', 'ORDER', 'PRODUCT');
  CREATE TYPE "public"."enum_notifications_target_type" AS ENUM('post', 'product', 'order');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('PENDING', 'PAID', 'PROCESSING', 'SENT_TO_FACTORY', 'IN_PRODUCTION', 'READY', 'SHIPPED', 'DELIVERED', 'CANCELLED');
  CREATE TYPE "public"."enum_products_material" AS ENUM('wood', 'metal', 'glass');
  CREATE TYPE "public"."enum_exports_format" AS ENUM('csv', 'json');
  CREATE TYPE "public"."enum_exports_sort_order" AS ENUM('asc', 'desc');
  CREATE TYPE "public"."enum_exports_drafts" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_imports_import_mode" AS ENUM('create', 'update', 'upsert');
  CREATE TYPE "public"."enum_imports_status" AS ENUM('pending', 'completed', 'partial', 'failed');
  CREATE TYPE "public"."enum_plugin_ai_instructions_field_type" AS ENUM('text', 'textarea', 'upload', 'richText');
  CREATE TYPE "public"."enum_plugin_ai_instructions_model_id" AS ENUM('Oai-text', 'dall-e', 'gpt-image-1', 'tts', 'Oai-object', 'ANTH-C-text', 'ANTH-C-object', 'GEMINI-text', 'GEMINI-object', 'imagen', '11Labs-m-v2', 'MINIMAX-text', 'MINIMAX-object');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_text_settings_model" AS ENUM('gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini', 'gpt-3.5-turbo');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_version" AS ENUM('dall-e-3', 'dall-e-2');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_size" AS ENUM('256x256', '512x512', '1024x1024', '1792x1024', '1024x1792');
  CREATE TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_style" AS ENUM('vivid', 'natural');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_version" AS ENUM('gpt-image-1');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_size" AS ENUM('1024x1024', '1024x1536', '1536x1024', 'auto');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_quality" AS ENUM('low', 'medium', 'high', 'auto');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_output_format" AS ENUM('png', 'jpeg', 'webp');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_background" AS ENUM('white', 'transparent');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_moderation" AS ENUM('auto', 'low');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_voice" AS ENUM('alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_model" AS ENUM('tts-1', 'tts-1-hd');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_response_format" AS ENUM('mp3', 'opus', 'aac', 'flac', 'wav', 'pcm');
  CREATE TYPE "public"."enum_plugin_ai_instructions_oai_object_settings_model" AS ENUM('gpt-5', 'gpt-5-mini', 'gpt-5-nano', 'gpt-4.1', 'gpt-4o', 'gpt-4-turbo', 'gpt-4o-mini', 'gpt-3.5-turbo');
  CREATE TYPE "public"."enum_plugin_ai_instructions_anth_c_text_settings_model" AS ENUM('claude-opus-4-1', 'claude-opus-4-0', 'claude-sonnet-4-0', 'claude-3-opus-latest', 'claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest', 'claude-3-7-sonnet-latest');
  CREATE TYPE "public"."enum_plugin_ai_instructions_anth_c_object_settings_model" AS ENUM('claude-opus-4-1', 'claude-opus-4-0', 'claude-sonnet-4-0', 'claude-3-opus-latest', 'claude-3-5-haiku-latest', 'claude-3-5-sonnet-latest', 'claude-3-7-sonnet-latest');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gemini_text_settings_model" AS ENUM('gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview', 'gemini-3-flash-preview', 'gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite');
  CREATE TYPE "public"."enum_plugin_ai_instructions_gemini_object_settings_model" AS ENUM('gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-3.1-pro-preview', 'gemini-3-flash-preview', 'gemini-2.5-pro', 'gemini-2.5-flash', 'gemini-2.5-flash-lite');
  CREATE TYPE "public"."enum_plugin_ai_instructions_imagen_settings_model" AS ENUM('imagen-4.0-fast-generate-001', 'imagen-4.0-generate-001', 'imagen-4.0-ultra-generate-001', 'imagen-3.0-generate-002');
  CREATE TYPE "public"."enum_plugin_ai_instructions_imagen_settings_aspect_ratio" AS ENUM('1:1', '3:4', '4:3', '9:16', '16:9');
  CREATE TYPE "public"."enum_plugin_ai_instructions_imagen_settings_output_mime_type" AS ENUM('image/png', 'image/jpeg');
  CREATE TYPE "public"."enum_plugin_ai_instructions_minimax_text_settings_model" AS ENUM('MiniMax-M3', 'MiniMax-M2.7', 'MiniMax-M2.7-highspeed');
  CREATE TYPE "public"."enum_plugin_ai_instructions_minimax_object_settings_model" AS ENUM('MiniMax-M3', 'MiniMax-M2.7', 'MiniMax-M2.7-highspeed');
  CREATE TYPE "public"."enum_janitor_findings_status" AS ENUM('found', 'keep', 'delete', 'deleted');
  CREATE TYPE "public"."enum_janitor_findings_kind" AS ENUM('orphan', 'missing', 'unused');
  CREATE TYPE "public"."enum_janitor_runs_mode" AS ENUM('scan', 'purge');
  CREATE TYPE "public"."enum_janitor_runs_status" AS ENUM('running', 'done', 'failed');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport', 'janitor-run');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'createCollectionExport', 'createCollectionImport', 'janitor-run');
  CREATE TABLE "users_role" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_role",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar NOT NULL,
  	"email_verified" boolean DEFAULT false,
  	"image" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"banned" boolean DEFAULT false,
  	"ban_reason" varchar,
  	"ban_expires" timestamp(3) with time zone,
  	"two_factor_enabled" boolean DEFAULT false,
  	"phone" varchar,
  	"address" varchar,
  	"status" varchar,
  	"display_name" varchar
  );
  
  CREATE TABLE "sessions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"token" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"ip_address" varchar,
  	"user_agent" varchar,
  	"user_id" integer NOT NULL,
  	"impersonated_by_id" integer
  );
  
  CREATE TABLE "accounts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"account_id" varchar NOT NULL,
  	"provider_id" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"access_token" varchar,
  	"refresh_token" varchar,
  	"id_token" varchar,
  	"access_token_expires_at" timestamp(3) with time zone,
  	"refresh_token_expires_at" timestamp(3) with time zone,
  	"scope" varchar,
  	"password" varchar,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "verifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"identifier" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "two_factors" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"secret" varchar NOT NULL,
  	"backup_codes" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"verified" boolean,
  	"failed_verification_count" numeric,
  	"locked_until" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "admin_invitations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_admin_invitations_role" DEFAULT 'admin' NOT NULL,
  	"token" varchar NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"legacy_url" varchar,
  	"_key" varchar,
  	"prefix" varchar DEFAULT '',
  	"_objectkey" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"info" varchar,
  	"legacy_id" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"desc" varchar,
  	"content" jsonb,
  	"main_image_id" integer,
  	"author_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"discussions" boolean DEFAULT true,
  	"legacy_id" varchar,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "posts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tags_id" integer
  );
  
  CREATE TABLE "comments" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"parent_id" integer,
  	"target_type" "enum_comments_target_type" NOT NULL,
  	"target_id" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "notifications" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_notifications_type" NOT NULL,
  	"read" boolean DEFAULT false,
  	"issuer_id" integer NOT NULL,
  	"recipient_id" integer NOT NULL,
  	"target_type" "enum_notifications_target_type",
  	"target_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"image_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quantity" numeric NOT NULL,
  	"price" numeric NOT NULL,
  	"original_price" numeric,
  	"discount" numeric,
  	"product_id" varchar NOT NULL,
  	"color_id" varchar NOT NULL,
  	"product_name" varchar,
  	"product_slug" varchar,
  	"product_image" varchar,
  	"color_name" varchar,
  	"color_hex" varchar
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order_code" varchar NOT NULL,
  	"user_id" integer NOT NULL,
  	"recipient" varchar NOT NULL,
  	"phone" varchar,
  	"address" varchar,
  	"total" numeric NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'PENDING',
  	"payment_id" varchar,
  	"payment_date" timestamp(3) with time zone,
  	"notes" varchar,
  	"admin_note" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"caption" varchar
  );
  
  CREATE TABLE "products_colors" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"color" varchar NOT NULL,
  	"price" numeric NOT NULL,
  	"discount" numeric DEFAULT 0,
  	"stock" numeric DEFAULT 0
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"desc" varchar,
  	"category_id" integer NOT NULL,
  	"material" "enum_products_material",
  	"content" jsonb,
  	"seller_id" integer,
  	"dimensions" varchar,
  	"assembly_required" boolean DEFAULT false,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"format" "enum_exports_format" DEFAULT 'csv' NOT NULL,
  	"limit" numeric,
  	"page" numeric DEFAULT 1,
  	"sort" varchar,
  	"sort_order" "enum_exports_sort_order",
  	"drafts" "enum_exports_drafts" DEFAULT 'yes',
  	"collection_slug" varchar DEFAULT 'users' NOT NULL,
  	"where" jsonb DEFAULT '{}'::jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "exports_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "imports" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"collection_slug" varchar DEFAULT 'users' NOT NULL,
  	"import_mode" "enum_imports_import_mode",
  	"match_field" varchar DEFAULT 'id',
  	"status" "enum_imports_status" DEFAULT 'pending',
  	"summary_imported" numeric,
  	"summary_updated" numeric,
  	"summary_total" numeric,
  	"summary_issues" numeric,
  	"summary_issue_details" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "plugin_ai_instructions_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "plugin_ai_instructions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"schema_path" varchar,
  	"field_type" "enum_plugin_ai_instructions_field_type" DEFAULT 'text',
  	"relation_to" varchar,
  	"model_id" "enum_plugin_ai_instructions_model_id",
  	"disabled" boolean DEFAULT false,
  	"prompt" varchar,
  	"system" varchar DEFAULT 'INSTRUCTIONS:
  You are a highly skilled and professional blog writer,
  renowned for crafting engaging and well-organized articles.
  When given a title, you meticulously create blogs that are not only
  informative and accurate but also captivating and beautifully structured.',
  	"layout" varchar DEFAULT '[paragraph] - Write a concise introduction (2-3 sentences) that outlines the main topic.
  [horizontalrule] - Insert a horizontal rule to separate the introduction from the main content.
  [list] - Create a list with 3-5 items. Each list item should contain:
     a. [heading] - A brief, descriptive heading (up to 5 words)
     b. [paragraph] - A short explanation or elaboration (1-2 sentences)
  [horizontalrule] - Insert another horizontal rule to separate the main content from the conclusion.
  [paragraph] - Compose a brief conclusion (2-3 sentences) summarizing the key points.
  [quote] - Include a relevant quote from a famous person, directly related to the topic. Format: "Quote text." - Author Name',
  	"oai_text_settings_model" "enum_plugin_ai_instructions_oai_text_settings_model" DEFAULT 'gpt-4o-mini',
  	"oai_text_settings_max_tokens" numeric DEFAULT 5000,
  	"oai_text_settings_temperature" numeric DEFAULT 0.7,
  	"oai_text_settings_extract_attachments" boolean,
  	"dalle_e_settings_version" "enum_plugin_ai_instructions_dalle_e_settings_version" DEFAULT 'dall-e-3',
  	"dalle_e_settings_size" "enum_plugin_ai_instructions_dalle_e_settings_size" DEFAULT '1024x1024',
  	"dalle_e_settings_style" "enum_plugin_ai_instructions_dalle_e_settings_style" DEFAULT 'natural',
  	"dalle_e_settings_enable_prompt_optimization" boolean,
  	"gpt_image_1_settings_version" "enum_plugin_ai_instructions_gpt_image_1_settings_version" DEFAULT 'gpt-image-1',
  	"gpt_image_1_settings_size" "enum_plugin_ai_instructions_gpt_image_1_settings_size" DEFAULT 'auto',
  	"gpt_image_1_settings_quality" "enum_plugin_ai_instructions_gpt_image_1_settings_quality" DEFAULT 'auto',
  	"gpt_image_1_settings_output_format" "enum_plugin_ai_instructions_gpt_image_1_settings_output_format" DEFAULT 'png',
  	"gpt_image_1_settings_output_compression" numeric DEFAULT 100,
  	"gpt_image_1_settings_background" "enum_plugin_ai_instructions_gpt_image_1_settings_background" DEFAULT 'white',
  	"gpt_image_1_settings_moderation" "enum_plugin_ai_instructions_gpt_image_1_settings_moderation" DEFAULT 'auto',
  	"oai_tts_settings_voice" "enum_plugin_ai_instructions_oai_tts_settings_voice" DEFAULT 'alloy',
  	"oai_tts_settings_model" "enum_plugin_ai_instructions_oai_tts_settings_model" DEFAULT 'tts-1',
  	"oai_tts_settings_response_format" "enum_plugin_ai_instructions_oai_tts_settings_response_format" DEFAULT 'mp3',
  	"oai_tts_settings_speed" numeric DEFAULT 1,
  	"oai_object_settings_model" "enum_plugin_ai_instructions_oai_object_settings_model" DEFAULT 'gpt-4o',
  	"oai_object_settings_max_tokens" numeric DEFAULT 5000,
  	"oai_object_settings_temperature" numeric DEFAULT 0.7,
  	"oai_object_settings_extract_attachments" boolean,
  	"anth_c_text_settings_model" "enum_plugin_ai_instructions_anth_c_text_settings_model" DEFAULT 'claude-3-5-sonnet-latest',
  	"anth_c_text_settings_max_tokens" numeric DEFAULT 5000,
  	"anth_c_text_settings_temperature" numeric DEFAULT 0.7,
  	"anth_c_text_settings_extract_attachments" boolean,
  	"anth_c_object_settings_model" "enum_plugin_ai_instructions_anth_c_object_settings_model" DEFAULT 'claude-3-5-sonnet-latest',
  	"anth_c_object_settings_max_tokens" numeric DEFAULT 5000,
  	"anth_c_object_settings_temperature" numeric DEFAULT 0.7,
  	"anth_c_object_settings_extract_attachments" boolean,
  	"gemini_text_settings_model" "enum_plugin_ai_instructions_gemini_text_settings_model" DEFAULT 'gemini-3.7-flash',
  	"gemini_text_settings_max_tokens" numeric DEFAULT 5000,
  	"gemini_text_settings_temperature" numeric DEFAULT 0.7,
  	"gemini_text_settings_extract_attachments" boolean,
  	"gemini_object_settings_model" "enum_plugin_ai_instructions_gemini_object_settings_model" DEFAULT 'gemini-3.7-flash',
  	"gemini_object_settings_max_tokens" numeric DEFAULT 5000,
  	"gemini_object_settings_temperature" numeric DEFAULT 0.7,
  	"gemini_object_settings_extract_attachments" boolean,
  	"imagen_settings_model" "enum_plugin_ai_instructions_imagen_settings_model" DEFAULT 'imagen-4.0-fast-generate-001',
  	"imagen_settings_aspect_ratio" "enum_plugin_ai_instructions_imagen_settings_aspect_ratio" DEFAULT '1:1',
  	"imagen_settings_output_mime_type" "enum_plugin_ai_instructions_imagen_settings_output_mime_type" DEFAULT 'image/png',
  	"11labs_settings_voice_id" varchar,
  	"11labs_settings_stability" numeric DEFAULT 0.5,
  	"11labs_settings_similarity_boost" numeric DEFAULT 0.5,
  	"11labs_settings_style" numeric DEFAULT 0.5,
  	"11labs_settings_use_speaker_boost" boolean,
  	"11labs_settings_seed" numeric,
  	"11labs_settings_previous_text" varchar,
  	"11labs_settings_next_text" varchar,
  	"minimax_text_settings_model" "enum_plugin_ai_instructions_minimax_text_settings_model" DEFAULT 'MiniMax-M3',
  	"minimax_text_settings_max_tokens" numeric DEFAULT 5000,
  	"minimax_text_settings_temperature" numeric DEFAULT 0.7,
  	"minimax_text_settings_extract_attachments" boolean,
  	"minimax_object_settings_model" "enum_plugin_ai_instructions_minimax_object_settings_model" DEFAULT 'MiniMax-M3',
  	"minimax_object_settings_max_tokens" numeric DEFAULT 5000,
  	"minimax_object_settings_temperature" numeric DEFAULT 0.7,
  	"minimax_object_settings_extract_attachments" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "janitor_findings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_janitor_findings_status" DEFAULT 'found' NOT NULL,
  	"note" varchar,
  	"error" varchar,
  	"usage" jsonb,
  	"object_key" varchar NOT NULL,
  	"ref" varchar,
  	"kind" "enum_janitor_findings_kind" NOT NULL,
  	"collection_slug" varchar NOT NULL,
  	"document_id" varchar,
  	"size" numeric,
  	"uploaded_at" timestamp(3) with time zone,
  	"last_seen_at" timestamp(3) with time zone,
  	"run_id" integer,
  	"purged_by_id" integer,
  	"purged_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "janitor_runs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"lock" varchar,
  	"started_at" timestamp(3) with time zone NOT NULL,
  	"heartbeat_at" timestamp(3) with time zone,
  	"finished_at" timestamp(3) with time zone,
  	"mode" "enum_janitor_runs_mode" NOT NULL,
  	"status" "enum_janitor_runs_status" DEFAULT 'running' NOT NULL,
  	"scanned" numeric,
  	"orphans" numeric,
  	"missing" numeric,
  	"unused" numeric,
  	"reclaimable_bytes" numeric,
  	"deleted" numeric,
  	"failed" numeric,
  	"skipped" numeric,
  	"freed_bytes" numeric,
  	"error" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"sessions_id" integer,
  	"accounts_id" integer,
  	"verifications_id" integer,
  	"two_factors_id" integer,
  	"admin_invitations_id" integer,
  	"media_id" integer,
  	"tags_id" integer,
  	"posts_id" integer,
  	"comments_id" integer,
  	"notifications_id" integer,
  	"categories_id" integer,
  	"orders_id" integer,
  	"products_id" integer,
  	"plugin_ai_instructions_id" integer,
  	"janitor_findings_id" integer,
  	"janitor_runs_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_role" ADD CONSTRAINT "users_role_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sessions" ADD CONSTRAINT "sessions_impersonated_by_id_users_id_fk" FOREIGN KEY ("impersonated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "two_factors" ADD CONSTRAINT "two_factors_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_main_image_id_media_id_fk" FOREIGN KEY ("main_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_issuer_id_users_id_fk" FOREIGN KEY ("issuer_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_images" ADD CONSTRAINT "products_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_colors" ADD CONSTRAINT "products_colors_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seller_id_users_id_fk" FOREIGN KEY ("seller_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exports_texts" ADD CONSTRAINT "exports_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."exports"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "plugin_ai_instructions_images" ADD CONSTRAINT "plugin_ai_instructions_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "plugin_ai_instructions_images" ADD CONSTRAINT "plugin_ai_instructions_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plugin_ai_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "janitor_findings" ADD CONSTRAINT "janitor_findings_run_id_janitor_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."janitor_runs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "janitor_findings" ADD CONSTRAINT "janitor_findings_purged_by_id_janitor_runs_id_fk" FOREIGN KEY ("purged_by_id") REFERENCES "public"."janitor_runs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sessions_fk" FOREIGN KEY ("sessions_id") REFERENCES "public"."sessions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_accounts_fk" FOREIGN KEY ("accounts_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verifications_fk" FOREIGN KEY ("verifications_id") REFERENCES "public"."verifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_two_factors_fk" FOREIGN KEY ("two_factors_id") REFERENCES "public"."two_factors"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_admin_invitations_fk" FOREIGN KEY ("admin_invitations_id") REFERENCES "public"."admin_invitations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tags_fk" FOREIGN KEY ("tags_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_comments_fk" FOREIGN KEY ("comments_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_notifications_fk" FOREIGN KEY ("notifications_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plugin_ai_instructions_fk" FOREIGN KEY ("plugin_ai_instructions_id") REFERENCES "public"."plugin_ai_instructions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_janitor_findings_fk" FOREIGN KEY ("janitor_findings_id") REFERENCES "public"."janitor_findings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_janitor_runs_fk" FOREIGN KEY ("janitor_runs_id") REFERENCES "public"."janitor_runs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_role_order_idx" ON "users_role" USING btree ("order");
  CREATE INDEX "users_role_parent_idx" ON "users_role" USING btree ("parent_id");
  CREATE UNIQUE INDEX "users_name_idx" ON "users" USING btree ("name");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE UNIQUE INDEX "sessions_token_idx" ON "sessions" USING btree ("token");
  CREATE INDEX "sessions_created_at_idx" ON "sessions" USING btree ("created_at");
  CREATE INDEX "sessions_updated_at_idx" ON "sessions" USING btree ("updated_at");
  CREATE INDEX "sessions_user_idx" ON "sessions" USING btree ("user_id");
  CREATE INDEX "sessions_impersonated_by_idx" ON "sessions" USING btree ("impersonated_by_id");
  CREATE INDEX "accounts_account_id_idx" ON "accounts" USING btree ("account_id");
  CREATE INDEX "accounts_user_idx" ON "accounts" USING btree ("user_id");
  CREATE INDEX "accounts_created_at_idx" ON "accounts" USING btree ("created_at");
  CREATE INDEX "accounts_updated_at_idx" ON "accounts" USING btree ("updated_at");
  CREATE INDEX "verifications_identifier_idx" ON "verifications" USING btree ("identifier");
  CREATE INDEX "verifications_created_at_idx" ON "verifications" USING btree ("created_at");
  CREATE INDEX "verifications_updated_at_idx" ON "verifications" USING btree ("updated_at");
  CREATE INDEX "two_factors_secret_idx" ON "two_factors" USING btree ("secret");
  CREATE INDEX "two_factors_user_idx" ON "two_factors" USING btree ("user_id");
  CREATE INDEX "two_factors_updated_at_idx" ON "two_factors" USING btree ("updated_at");
  CREATE INDEX "two_factors_created_at_idx" ON "two_factors" USING btree ("created_at");
  CREATE INDEX "admin_invitations_token_idx" ON "admin_invitations" USING btree ("token");
  CREATE INDEX "admin_invitations_updated_at_idx" ON "admin_invitations" USING btree ("updated_at");
  CREATE INDEX "admin_invitations_created_at_idx" ON "admin_invitations" USING btree ("created_at");
  CREATE INDEX "media_legacy_url_idx" ON "media" USING btree ("legacy_url");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "tags_legacy_id_idx" ON "tags" USING btree ("legacy_id");
  CREATE UNIQUE INDEX "tags_slug_idx" ON "tags" USING btree ("slug");
  CREATE INDEX "tags_updated_at_idx" ON "tags" USING btree ("updated_at");
  CREATE INDEX "tags_created_at_idx" ON "tags" USING btree ("created_at");
  CREATE INDEX "posts_main_image_idx" ON "posts" USING btree ("main_image_id");
  CREATE INDEX "posts_author_idx" ON "posts" USING btree ("author_id");
  CREATE UNIQUE INDEX "posts_legacy_id_idx" ON "posts" USING btree ("legacy_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_meta_meta_image_idx" ON "posts" USING btree ("meta_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts_rels_order_idx" ON "posts_rels" USING btree ("order");
  CREATE INDEX "posts_rels_parent_idx" ON "posts_rels" USING btree ("parent_id");
  CREATE INDEX "posts_rels_path_idx" ON "posts_rels" USING btree ("path");
  CREATE INDEX "posts_rels_tags_id_idx" ON "posts_rels" USING btree ("tags_id");
  CREATE INDEX "comments_user_idx" ON "comments" USING btree ("user_id");
  CREATE INDEX "comments_parent_idx" ON "comments" USING btree ("parent_id");
  CREATE INDEX "comments_target_type_idx" ON "comments" USING btree ("target_type");
  CREATE INDEX "comments_target_id_idx" ON "comments" USING btree ("target_id");
  CREATE INDEX "comments_updated_at_idx" ON "comments" USING btree ("updated_at");
  CREATE INDEX "comments_created_at_idx" ON "comments" USING btree ("created_at");
  CREATE INDEX "notifications_issuer_idx" ON "notifications" USING btree ("issuer_id");
  CREATE INDEX "notifications_recipient_idx" ON "notifications" USING btree ("recipient_id");
  CREATE INDEX "notifications_target_id_idx" ON "notifications" USING btree ("target_id");
  CREATE INDEX "notifications_updated_at_idx" ON "notifications" USING btree ("updated_at");
  CREATE INDEX "notifications_created_at_idx" ON "notifications" USING btree ("created_at");
  CREATE INDEX "categories_image_idx" ON "categories" USING btree ("image_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "orders_order_code_idx" ON "orders" USING btree ("order_code");
  CREATE INDEX "orders_user_idx" ON "orders" USING btree ("user_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "products_images_order_idx" ON "products_images" USING btree ("_order");
  CREATE INDEX "products_images_parent_id_idx" ON "products_images" USING btree ("_parent_id");
  CREATE INDEX "products_images_image_idx" ON "products_images" USING btree ("image_id");
  CREATE INDEX "products_colors_order_idx" ON "products_colors" USING btree ("_order");
  CREATE INDEX "products_colors_parent_id_idx" ON "products_colors" USING btree ("_parent_id");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_seller_idx" ON "products" USING btree ("seller_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "exports_updated_at_idx" ON "exports" USING btree ("updated_at");
  CREATE INDEX "exports_created_at_idx" ON "exports" USING btree ("created_at");
  CREATE UNIQUE INDEX "exports_filename_idx" ON "exports" USING btree ("filename");
  CREATE INDEX "exports_texts_order_parent" ON "exports_texts" USING btree ("order","parent_id");
  CREATE INDEX "imports_updated_at_idx" ON "imports" USING btree ("updated_at");
  CREATE INDEX "imports_created_at_idx" ON "imports" USING btree ("created_at");
  CREATE UNIQUE INDEX "imports_filename_idx" ON "imports" USING btree ("filename");
  CREATE INDEX "plugin_ai_instructions_images_order_idx" ON "plugin_ai_instructions_images" USING btree ("_order");
  CREATE INDEX "plugin_ai_instructions_images_parent_id_idx" ON "plugin_ai_instructions_images" USING btree ("_parent_id");
  CREATE INDEX "plugin_ai_instructions_images_image_idx" ON "plugin_ai_instructions_images" USING btree ("image_id");
  CREATE UNIQUE INDEX "plugin_ai_instructions_schema_path_idx" ON "plugin_ai_instructions" USING btree ("schema_path");
  CREATE INDEX "plugin_ai_instructions_updated_at_idx" ON "plugin_ai_instructions" USING btree ("updated_at");
  CREATE INDEX "plugin_ai_instructions_created_at_idx" ON "plugin_ai_instructions" USING btree ("created_at");
  CREATE INDEX "janitor_findings_status_idx" ON "janitor_findings" USING btree ("status");
  CREATE INDEX "janitor_findings_object_key_idx" ON "janitor_findings" USING btree ("object_key");
  CREATE INDEX "janitor_findings_kind_idx" ON "janitor_findings" USING btree ("kind");
  CREATE INDEX "janitor_findings_collection_slug_idx" ON "janitor_findings" USING btree ("collection_slug");
  CREATE INDEX "janitor_findings_run_idx" ON "janitor_findings" USING btree ("run_id");
  CREATE INDEX "janitor_findings_purged_by_idx" ON "janitor_findings" USING btree ("purged_by_id");
  CREATE INDEX "janitor_findings_updated_at_idx" ON "janitor_findings" USING btree ("updated_at");
  CREATE INDEX "janitor_findings_created_at_idx" ON "janitor_findings" USING btree ("created_at");
  CREATE UNIQUE INDEX "collectionSlug_objectKey_idx" ON "janitor_findings" USING btree ("collection_slug","object_key");
  CREATE UNIQUE INDEX "janitor_runs_lock_idx" ON "janitor_runs" USING btree ("lock");
  CREATE INDEX "janitor_runs_started_at_idx" ON "janitor_runs" USING btree ("started_at");
  CREATE INDEX "janitor_runs_heartbeat_at_idx" ON "janitor_runs" USING btree ("heartbeat_at");
  CREATE INDEX "janitor_runs_updated_at_idx" ON "janitor_runs" USING btree ("updated_at");
  CREATE INDEX "janitor_runs_created_at_idx" ON "janitor_runs" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_sessions_id_idx" ON "payload_locked_documents_rels" USING btree ("sessions_id");
  CREATE INDEX "payload_locked_documents_rels_accounts_id_idx" ON "payload_locked_documents_rels" USING btree ("accounts_id");
  CREATE INDEX "payload_locked_documents_rels_verifications_id_idx" ON "payload_locked_documents_rels" USING btree ("verifications_id");
  CREATE INDEX "payload_locked_documents_rels_two_factors_id_idx" ON "payload_locked_documents_rels" USING btree ("two_factors_id");
  CREATE INDEX "payload_locked_documents_rels_admin_invitations_id_idx" ON "payload_locked_documents_rels" USING btree ("admin_invitations_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("tags_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_comments_id_idx" ON "payload_locked_documents_rels" USING btree ("comments_id");
  CREATE INDEX "payload_locked_documents_rels_notifications_id_idx" ON "payload_locked_documents_rels" USING btree ("notifications_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_plugin_ai_instructions_id_idx" ON "payload_locked_documents_rels" USING btree ("plugin_ai_instructions_id");
  CREATE INDEX "payload_locked_documents_rels_janitor_findings_id_idx" ON "payload_locked_documents_rels" USING btree ("janitor_findings_id");
  CREATE INDEX "payload_locked_documents_rels_janitor_runs_id_idx" ON "payload_locked_documents_rels" USING btree ("janitor_runs_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_role" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "sessions" CASCADE;
  DROP TABLE "accounts" CASCADE;
  DROP TABLE "verifications" CASCADE;
  DROP TABLE "two_factors" CASCADE;
  DROP TABLE "admin_invitations" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "tags" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "posts_rels" CASCADE;
  DROP TABLE "comments" CASCADE;
  DROP TABLE "notifications" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "products_images" CASCADE;
  DROP TABLE "products_colors" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "exports" CASCADE;
  DROP TABLE "exports_texts" CASCADE;
  DROP TABLE "imports" CASCADE;
  DROP TABLE "plugin_ai_instructions_images" CASCADE;
  DROP TABLE "plugin_ai_instructions" CASCADE;
  DROP TABLE "janitor_findings" CASCADE;
  DROP TABLE "janitor_runs" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_admin_invitations_role";
  DROP TYPE "public"."enum_comments_target_type";
  DROP TYPE "public"."enum_notifications_type";
  DROP TYPE "public"."enum_notifications_target_type";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_products_material";
  DROP TYPE "public"."enum_exports_format";
  DROP TYPE "public"."enum_exports_sort_order";
  DROP TYPE "public"."enum_exports_drafts";
  DROP TYPE "public"."enum_imports_import_mode";
  DROP TYPE "public"."enum_imports_status";
  DROP TYPE "public"."enum_plugin_ai_instructions_field_type";
  DROP TYPE "public"."enum_plugin_ai_instructions_model_id";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_text_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_version";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_size";
  DROP TYPE "public"."enum_plugin_ai_instructions_dalle_e_settings_style";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_version";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_size";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_quality";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_output_format";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_background";
  DROP TYPE "public"."enum_plugin_ai_instructions_gpt_image_1_settings_moderation";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_voice";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_tts_settings_response_format";
  DROP TYPE "public"."enum_plugin_ai_instructions_oai_object_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_anth_c_text_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_anth_c_object_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_gemini_text_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_gemini_object_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_imagen_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_imagen_settings_aspect_ratio";
  DROP TYPE "public"."enum_plugin_ai_instructions_imagen_settings_output_mime_type";
  DROP TYPE "public"."enum_plugin_ai_instructions_minimax_text_settings_model";
  DROP TYPE "public"."enum_plugin_ai_instructions_minimax_object_settings_model";
  DROP TYPE "public"."enum_janitor_findings_status";
  DROP TYPE "public"."enum_janitor_findings_kind";
  DROP TYPE "public"."enum_janitor_runs_mode";
  DROP TYPE "public"."enum_janitor_runs_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
