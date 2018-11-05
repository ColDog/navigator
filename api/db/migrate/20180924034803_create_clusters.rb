class CreateClusters < ActiveRecord::Migration[5.1]
  def change
    create_table :clusters do |t|
      t.references :app,        foreign_key: { on_delete: :cascade }
      t.references :stage,      foreign_key: { on_delete: :cascade }
      t.string     :uid,        null: false, unique: true
      t.string     :name,       null: false
      t.text       :values

      t.timestamps
    end
  end
end
