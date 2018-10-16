class CreateApps < ActiveRecord::Migration[5.1]
  def change
    create_table :apps do |t|
      t.string :uid,  null: false, unique: true
      t.string :name, null: false, unique: true

      t.timestamps
    end
  end
end
