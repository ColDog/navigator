class CreateApps < ActiveRecord::Migration[5.1]
  def change
    create_table :apps, id: false do |t|
      t.string :id,    primary: true
      t.string :name,  null: false
      t.text   :stages

      t.timestamps
    end
  end
end
