module ViewHelper
  def to_yaml(value)
    YAML.dump(value)
  end
end
