class CreateApps < ActiveRecord::Migration[5.1]
  def change
    create_table :apps do |t|
      t.string :uid, unique: true, null: false
      t.string :name,  null: false
      t.text   :stages

      t.timestamps
    end
  end
end
