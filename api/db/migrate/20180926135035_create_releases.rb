class CreateReleases < ActiveRecord::Migration[5.1]
  def change
    create_table :releases do |t|
      t.string     :uid,   unique: true, null: false
      t.references :build, foreign_key: { on_delete: :cascade }
      t.string     :status
      t.boolean    :removal,  null: false, default: false

      t.timestamps
    end
  end
end
