# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180927031312) do

  create_table "apps", force: :cascade do |t|
    t.string "uid", null: false
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "builds", force: :cascade do |t|
    t.integer "app_id"
    t.integer "stage_id"
    t.string "uid", null: false
    t.string "version", null: false
    t.text "values"
    t.integer "number", null: false
    t.boolean "promoted", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["app_id", "stage_id", "version"], name: "index_builds_on_app_id_and_stage_id_and_version", unique: true
    t.index ["app_id"], name: "index_builds_on_app_id"
    t.index ["stage_id"], name: "index_builds_on_stage_id"
  end

  create_table "clusters", force: :cascade do |t|
    t.integer "app_id"
    t.integer "stage_id"
    t.string "uid", null: false
    t.string "name", null: false
    t.text "values"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["app_id"], name: "index_clusters_on_app_id"
    t.index ["stage_id"], name: "index_clusters_on_stage_id"
  end

  create_table "deploys", force: :cascade do |t|
    t.integer "release_id"
    t.integer "cluster_id"
    t.string "uid", null: false
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["cluster_id"], name: "index_deploys_on_cluster_id"
    t.index ["release_id"], name: "index_deploys_on_release_id"
  end

  create_table "events", force: :cascade do |t|
    t.string "uid", null: false
    t.string "name"
    t.text "params"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_events_on_name"
  end

  create_table "releases", force: :cascade do |t|
    t.string "uid", null: false
    t.integer "build_id"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["build_id"], name: "index_releases_on_build_id"
  end

  create_table "stages", force: :cascade do |t|
    t.integer "app_id"
    t.string "uid", null: false
    t.string "name", null: false
    t.boolean "review", default: false, null: false
    t.boolean "auto", default: false, null: false
    t.boolean "promotion", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["app_id"], name: "index_stages_on_app_id"
  end

end
