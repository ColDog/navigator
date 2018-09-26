class CreateEvents < ActiveRecord::Migration[5.1]
  def change
    create_table :events do |t|
      t.string :name, index: true
      t.text   :params

      t.timestamps
    end
  end
end
