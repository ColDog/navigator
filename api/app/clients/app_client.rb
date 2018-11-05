class AppClient

  def self.create(config)
    new.create(config)
    nil
  end

  def self.manifest(app)
    new.get_app_manifest(app)
  end

  def create(config)
    app = get_or_create_app(config)

    (config[:stages] || []).each do |stage_config|
      stage = get_or_create_stage(app, stage_config)
      (stage_config[:clusters] || []).each do |cluster_config|
        get_or_create_cluster(app, stage.uid, cluster_config)
      end

      stage.clusters.each do |cluster|
        unless (stage_config[:clusters] || []).find { |c| c[:name] == cluster.name }
          Apps::DeleteClusterCommand.execute({ cluster_uid: cluster.uid })
        end
      end

    end

    app.stages.each do |stage|
      unless (config[:stages] || []).find { |s| s[:name] == stage.name }
        Apps::DeleteStageCommand.execute({ stage_uid: stage.uid })
      end
    end
  end

  def get_or_create_app(app_config)
    app_uid = App.find_by_name(app_config[:name]).try(:uid)
    Apps::UpsertCommand.execute(app_config.merge(
      app_uid: app_uid,
    ))

    App.find_by_name!(app_config[:name])
  end

  def get_or_create_stage(app, stage_config)
    stage_uid = Stage.find_by_name(stage_config[:name]).try(:uid)
    Apps::UpsertStageCommand.execute(stage_config.merge(
      stage_uid: stage_uid,
      app_uid:  app.uid
    ))

    Stage.find_by!(app: app, name: stage_config[:name])
  end

  def get_or_create_cluster(app, stage_uid, cluster_config)
    cluster_uid = Cluster.find_by(
      name: cluster_config[:name],
      stage: Stage.find_by_uid!(stage_uid),
    ).try(:uid)

    Apps::UpsertClusterCommand.execute(cluster_config.merge(
      cluster_uid: cluster_uid,
      stage_uid:   stage_uid,
      app_uid:     app.uid
    ))

    Cluster.find_by!(app: app, name: cluster_config[:name]).uid
  end

  def get_app_manifest(app)
    manifest = {}
    manifest[:name] = app.name

    manifest[:stages] = app.stages.map do |stage|
      stage_map = stage.slice(:name, :review, :auto, :promotion)
      stage_map[:clusters] = stage.clusters.map do |cluster|
        cluster.slice(:name, :values)
      end
      stage_map
    end

    manifest
  end

end
