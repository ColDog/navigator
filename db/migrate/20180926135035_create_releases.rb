class CreateReleases < ActiveRecord::Migration[5.1]
  def change
    create_table :releases do |t|
      t.string     :uid,   unique: true, null: false
      t.references :build, foreign_key: true
      t.string     :status

      t.timestamps
    end
  end
end
