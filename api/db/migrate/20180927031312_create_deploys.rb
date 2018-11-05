class CreateDeploys < ActiveRecord::Migration[5.1]
  def change
    create_table :deploys do |t|
      t.references :release, foreign_key: { on_delete: :cascade }
      t.references :cluster, foreign_key: { on_delete: :cascade }
      t.string     :uid, unique: true, null: false
      t.string     :status

      t.timestamps
    end
  end
end
