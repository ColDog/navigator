class CreateBuilds < ActiveRecord::Migration[5.1]
  def change
    create_table :builds do |t|
      t.references :app,      foreign_key: true
      t.references :stage,    foreign_key: true
      t.string     :uid,      unique: true, null: false
      t.string     :version,  null: false
      t.text       :values
      t.integer    :number,   null: false, unique: true
      t.boolean    :promoted, null: false, default: false

      t.index [:app_id, :stage_id, :version], unique: true
      t.timestamps
    end
  end
end
