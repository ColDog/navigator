class CreateReleaseLogs < ActiveRecord::Migration[5.1]
  def change
    create_table :release_logs do |t|
      t.string :release_uid, null: false
      t.string :line,        null: false

      t.timestamps
    end
  end
end
