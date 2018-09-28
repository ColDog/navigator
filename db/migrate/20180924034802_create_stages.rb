class CreateStages < ActiveRecord::Migration[5.1]
  def change
    create_table :stages do |t|
      t.references :app,        foreign_key: true
      t.string     :uid,        unique: true, null: false
      t.string     :name,       null: false
      t.boolean    :review,     null: false, default: false
      t.boolean    :auto,       null: false, default: false
      t.boolean    :promotion,  null: false, default: false

      t.timestamps
    end
  end
end
